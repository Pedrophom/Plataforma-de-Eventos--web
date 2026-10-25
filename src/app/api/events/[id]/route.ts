import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const evento = await prisma.evento.findUnique({ where: { id } });
    if (!evento) return NextResponse.json({ error: 'Evento não encontrado.' }, { status: 404 });
    return NextResponse.json(evento);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar evento.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const eventoAtualizado = await prisma.evento.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(eventoAtualizado);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar evento.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.evento.delete({ where: { id } });
    return NextResponse.json({ message: 'Evento excluído com sucesso.' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir evento.' }, { status: 500 });
  }
}