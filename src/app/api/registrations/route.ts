import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

// GET /api/registrations (Lista os eventos que o usuário se inscreveu)
export async function GET(req: NextRequest) {
  try {
    const usuarioId = req.nextUrl.searchParams.get('usuarioId');
    if (!usuarioId) return NextResponse.json({ error: 'ID do usuário necessário.' }, { status: 400 });

    const inscricoes = await prisma.inscricao.findMany({
      where: { usuarioId },
      include: { evento: true }, // O Prisma já traz os dados do evento junto!
    });
    return NextResponse.json(inscricoes);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar inscrições.' }, { status: 500 });
  }
}