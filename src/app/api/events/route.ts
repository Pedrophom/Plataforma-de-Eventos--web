import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

// Rota para LISTAR eventos (GET /api/events)
export async function GET() {
  try {
    const eventos = await prisma.evento.findMany({
      orderBy: { criadoEm: 'desc' }
    });
    return NextResponse.json(eventos);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar eventos.' }, { status: 500 });
  }
}

// Rota para CRIAR evento (POST /api/events)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validação simples para garantir que os campos obrigatórios vieram
    if (!body.titulo || !body.data || !body.local) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando.' }, { status: 400 });
    }

    const novoEvento = await prisma.evento.create({
      data: {
        titulo: body.titulo,
        descricao: body.descricao,
        data: body.data,
        horario: body.horario,
        local: body.local,
        imagem: body.imagem,
      }
    });

    return NextResponse.json(novoEvento, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar evento.' }, { status: 500 });
  }
}