import { NextResponse } from 'next/server';
import { prisma } from '@/app/src/lib/db';
import { getSession } from '@/app/src/lib/auth';

interface Params { id: string }

export async function DELETE(
  request: Request,
  { params }: { params: Params }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'ID da visita não fornecido' }, { status: 400 });
  }

  try {
    const visit = await prisma.carVisit.findUnique({ where: { id } });
    if (!visit) {
      return NextResponse.json({ error: 'Visita não encontrada' }, { status: 404 });
    }

    // Só o dono da visita ou admin pode deletar
    if (visit.userId !== session.id && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    await prisma.carVisit.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Falha ao excluir visita' }, { status: 500 });
  }
}
