import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // A correção do Next.js 15: aguardar os params antes de extrair o ID
    const { id } = await params;

    // Primeiro apagamos as inscrições deste utilizador para evitar erros de chave estrangeira
    await prisma.inscricao.deleteMany({
      where: { usuarioId: id }
    });

    // Depois apagamos o utilizador
    await prisma.usuario.delete({
      where: { id }
    });
    
    return NextResponse.json({ sucesso: true });
  } catch (error) {
    return NextResponse.json({ erro: "Erro ao apagar utilizador" }, { status: 500 });
  }
}