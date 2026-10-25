import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; 
    
    await prisma.inscricao.delete({ where: { id } });
    return NextResponse.json({ message: 'Inscrição cancelada com sucesso.' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao cancelar inscrição.' }, { status: 500 });
  }
}