import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma"; 
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    // 1. Verifica a autenticação do aluno (Token)
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "sua_chave_secreta_aqui";
    const decoded = jwt.verify(token, secret) as { userId: string, id?: string };
    const usuarioId = decoded.userId || decoded.id;

    if (!usuarioId) {
      return NextResponse.json({ erro: "Token inválido" }, { status: 401 });
    }

    // 2. Pega o ID do evento que veio do telemóvel
    const body = await req.json();
    const { eventoId } = body;

    if (!eventoId) {
      return NextResponse.json({ erro: "ID do evento é obrigatório" }, { status: 400 });
    }

    // 3. Verifica se o aluno já se inscreveu neste evento antes
    const inscricaoExistente = await prisma.inscricao.findFirst({
      where: { 
        usuarioId: usuarioId, 
        eventoId: eventoId 
      }
    });

    if (inscricaoExistente) {
      return NextResponse.json({ erro: "Você já está inscrito neste evento." }, { status: 400 });
    }

    // 4. Regista a inscrição na base de dados
    const novaInscricao = await prisma.inscricao.create({
      data: {
        usuarioId,
        eventoId
      }
    });

    return NextResponse.json(novaInscricao, { status: 201 });
  } catch (error) {
    console.error("Erro ao inscrever:", error);
    return NextResponse.json({ erro: "Erro ao processar inscrição" }, { status: 500 });
  }
}