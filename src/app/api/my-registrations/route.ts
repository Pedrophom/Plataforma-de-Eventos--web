import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma"; // Ajuste o caminho do prisma se necessário
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // 1. Pega o token enviado pelo telemóvel
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    
    // 2. Descodifica o token para descobrir quem é o utilizador (usa o mesmo secret do login)
    const secret = process.env.JWT_SECRET || "sua_chave_secreta_aqui";
    const decoded = jwt.verify(token, secret) as { userId: string }; // ou id, dependendo de como fez no login

    // 3. Procura apenas as inscrições deste utilizador específico
    const inscricoes = await prisma.inscricao.findMany({
      where: { 
        usuarioId: decoded.userId || (decoded as any).id 
      },
      include: {
        evento: true // Traz os detalhes do evento junto com a inscrição
      },
      orderBy: {
        id: 'desc'
      }
    });

    return NextResponse.json(inscricoes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ erro: "Erro ao buscar as suas inscrições" }, { status: 500 });
  }
}