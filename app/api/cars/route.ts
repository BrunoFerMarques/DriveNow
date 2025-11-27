import { NextResponse } from 'next/server';
import { prisma } from '@/app/src/lib/db';
import { getSession } from '@/app/src/lib/auth';
import { z } from 'zod';

const carSchema = z.object({
    brand: z.string(),
    model: z.string(),
    year: z.number(),
    type: z.enum(['RENT', 'SALE']).optional().default('RENT'),
    price: z.number(),
    imageUrl: z.string().optional(),
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const brand = searchParams.get('brand');
        const showAll = searchParams.get('all') === 'true';

        const where: any = {};

        if (showAll) {
            const session = await getSession();
            if (session?.role !== 'ADMIN') {
                where.available = true;
            }
        } else {
            where.available = true;
        }

        if (type) where.type = type;
        if (brand) where.brand = { contains: brand };

        const sort = searchParams.get('sort');

        const orderBy: any[] = [{ createdAt: 'desc' }];
        if (sort === 'popular') {
            orderBy.unshift({ transactions: { _count: 'desc' } });
        }

        const cars = await prisma.car.findMany({
            where,
            orderBy,
            include: {
                _count: {
                    select: { transactions: true }
                }
            }
        });
        return NextResponse.json(cars);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const data = carSchema.parse(body);

        const car = await prisma.car.create({ data });
        return NextResponse.json(car);
    } catch (error) {
        return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }
}
