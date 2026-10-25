import {
  connection,
  NextResponse,
  type NextRequest,
} from "next/server";

import { prisma } from "@/src/lib/prisma";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  userId?: string;
  id?: string;
}

export async function GET(req: NextRequest) {
  // Impede que o acesso aos dados da requisição
  // aconteça durante o prerendering.
  await connection();

  try {
    // 1. Obtém o token enviado pelo aplicativo móvel.
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { erro: "Não autorizado" },
        { status: 401 }
      );
    }

    // Espera o formato: Authorization: Bearer <token>
    const [scheme, token] = authHeader.split(/\s+/, 2);

    if (scheme?.toLowerCase() !== "bearer" || !token) {
      return NextResponse.json(
        { erro: "Token ausente ou malformado" },
        { status: 401 }
      );
    }

    // 2. Obtém o segredo configurado no ambiente.
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("A variável de ambiente JWT_SECRET não está configurada.");

      return NextResponse.json(
        { erro: "Erro de configuração do servidor" },
        { status: 500 }
      );
    }

    // 3. Valida o token e identifica o usuário.
    let decoded: TokenPayload;

    try {
      decoded = jwt.verify(token, secret) as TokenPayload;
    } catch {
      return NextResponse.json(
        { erro: "Token inválido ou expirado" },
        { status: 401 }
      );
    }

    const usuarioId = decoded.userId ?? decoded.id;

    if (typeof usuarioId !== "string" || !usuarioId.trim()) {
      return NextResponse.json(
        { erro: "Token sem identificador de usuário válido" },
        { status: 401 }
      );
    }

    // 4. Busca somente as inscrições deste usuário.
    const inscricoes = await prisma.inscricao.findMany({
      where: {
        usuarioId,
      },
      include: {
        evento: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    // 5. Retorna as inscrições encontradas.
    return NextResponse.json(inscricoes);
  } catch (error) {
    console.error(
      "Erro ao buscar as inscrições do usuário:",
      error
    );

    return NextResponse.json(
      { erro: "Erro ao buscar as suas inscrições" },
      { status: 500 }
    );
  }
}