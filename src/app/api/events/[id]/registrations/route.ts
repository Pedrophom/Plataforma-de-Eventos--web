import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { usuarioId } = await req.json();
    
    const inscricao = await prisma.inscricao.create({
      data: { usuarioId, eventoId: id },
    });
    return NextResponse.json(inscricao, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao inscrever. Verifique se já está inscrito.' }, { status: 400 });
  }
}