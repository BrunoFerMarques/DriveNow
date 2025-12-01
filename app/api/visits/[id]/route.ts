import { NextResponse } from 'next/server';
import { prisma } from '@/app/src/lib/db';
import { getSession } from '@/app/src/lib/auth';

interface Params {
  id: string;
}

export async function DELETE(
  request: Request,
 { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const  id  = (await params).id;
  if (!id) return NextResponse.json({ error: 'ID da visita não fornecido' }, { status: 400 });

  const visit = await prisma.carVisit.findUnique({ where: { id } });
  if (!visit) return NextResponse.json({ error: 'Visita não encontrada' }, { status: 404 });
  if (visit.userId !== session.id) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });

  await prisma.carVisit.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
