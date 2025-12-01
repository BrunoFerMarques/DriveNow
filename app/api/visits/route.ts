import { NextResponse } from 'next/server';
import { prisma } from '@/app/src/lib/db';
import { getSession } from '@/app/src/lib/auth';
import { z } from 'zod';

const visitSchema = z.object({
  carId: z.string(),
  userId: z.string(),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});

export async function GET(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const visits = await prisma.carVisit.findMany({
      where: {
        userId: session.id,
      },
      include: {
        car: true,
        user: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(visits);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



export async function POST(request: Request) {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const data = visitSchema.parse(body);

    const visit = await prisma.carVisit.create({
      data: {
        userId: data.userId,
        carId: data.carId,
        date: new Date(data.date),
      },
      include: { car: true, user: true },
    });

    return NextResponse.json({ success: true, visit });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Invalid data' }, { status: 400 });
  }
}
