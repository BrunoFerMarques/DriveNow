import { NextResponse } from 'next/server';
import { prisma } from '@/app/src/lib/db';
import { getSession } from '@/app/src/lib/auth';
import { z } from 'zod';

const carUpdateSchema = z.object({
    brand: z.string().optional(),
    model: z.string().optional(),
    year: z.number().optional(),
    type: z.enum(['RENT', 'SALE']).optional(),
    price: z.number().optional(),
    imageUrl: z.string().optional(),
    available: z.boolean().optional(),
});

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;

    try {
        const car = await prisma.car.findUnique({
            where: { id },
        });

        if (!car) {
            return NextResponse.json({ error: 'Carro não encontrado' }, { status: 404 });
        }

        return NextResponse.json(car);
    } catch (error) {
        return NextResponse.json({ error: 'Falha ao buscar carro' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    const id = (await params).id;

    try {
        const body = await request.json();
        const data = carUpdateSchema.parse(body);

        const car = await prisma.car.update({
            where: { id },
            data,
        });

        return NextResponse.json(car);
    } catch (error) {
        return NextResponse.json({ error: 'Falha ao atualizar carro' }, { status: 500 });
    }
}


export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  const id = (await params).id;
  try {
    await prisma.car.delete({ where: { id } });
    return NextResponse.json({ message: 'Veículo excluído com sucesso' });
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao excluir carro' }, { status: 500 });
  }
}