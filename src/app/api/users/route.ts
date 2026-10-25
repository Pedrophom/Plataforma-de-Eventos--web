import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { nome: 'asc' }
    });
    return NextResponse.json(usuarios);
  } catch (error) {
    return NextResponse.json({ erro: "Erro ao carregar utilizadores" }, { status: 500 });
  }
}