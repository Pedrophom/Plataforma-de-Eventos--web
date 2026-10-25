import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

// DELETE /api/registrations/:id (Cancela a inscrição)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.inscricao.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Inscrição cancelada com sucesso.' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao cancelar inscrição.' }, { status: 500 });
  }
}