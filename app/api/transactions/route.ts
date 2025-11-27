import { NextResponse } from 'next/server';
import { prisma } from '@/app/src/lib/db';
import { getSession } from '@/app/src/lib/auth';
import { z } from 'zod';

const transactionSchema = z.object({
    carId: z.string(),
    days: z.number().min(1),
    pickupLocation: z.string().min(1),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Formato de data inválido",
    }),
    paymentMethod: z.enum(['PIX', 'CREDIT_CARD']),
});

export async function GET(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const where: any = {};
    if (session.role !== 'ADMIN') {
        where.userId = session.id;
    }

    const transactions = await prisma.transaction.findMany({
        where,
        include: { car: true, user: true },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(transactions);
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { carId, days, pickupLocation, startDate: startDateStr, paymentMethod } = transactionSchema.parse(body);

        const car = await prisma.car.findUnique({ where: { id: carId } });
        if (!car || !car.available) {
            return NextResponse.json({ error: 'Carro indisponível' }, { status: 400 });
        }

        // Enforce RENT type
        if (car.type !== 'RENT') {
            // If we strictly only allow RENT now, we could error here, or just treat it as rent.
            // Given user request "remove all of the selling features", we assume everything is rent.
        }

        const startDate = new Date(startDateStr);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + days);

        // Check for overlapping transactions
        const overlapping = await prisma.transaction.findFirst({
            where: {
                carId: car.id,
                type: 'RENT',
                OR: [
                    {
                        startDate: { lte: endDate },
                        endDate: { gte: startDate }
                    }
                ]
            }
        });

        if (overlapping) {
            return NextResponse.json({ error: 'Carro já alugado para estas datas' }, { status: 400 });
        }

        const dailyRate = car.price * 0.0005;
        const totalValue = dailyRate * days;

        // Transaction
        const transaction = await prisma.$transaction(async (tx) => {
            const t = await tx.transaction.create({
                data: {
                    userId: session.id,
                    carId: car.id,
                    type: 'RENT', // Force RENT
                    startDate,
                    endDate,
                    totalValue,
                    pickupLocation,
                    paymentMethod,
                },
            });

            // Do NOT set available = false, as we allow future bookings if dates don't overlap
            // await tx.car.update({
            //     where: { id: car.id },
            //     data: { available: false },
            // });

            return t;
        });

        return NextResponse.json(transaction);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Transação falhou' }, { status: 500 });
    }
}
