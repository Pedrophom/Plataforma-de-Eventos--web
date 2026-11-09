import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. ADMIN FIXO
    const ADMIN_EMAIL = "admin@ifma.edu.br";
    const ADMIN_SENHA = "123456";

    if (email === ADMIN_EMAIL && password === ADMIN_SENHA) {
      const token = jwt.sign(
        { email: ADMIN_EMAIL, role: "ADMIN" },
        process.env.JWT_SECRET || "segredo_ifma_2026",
        { expiresIn: "1d" }
      );

      return NextResponse.json({ 
        token, 
        message: "Login de Administrador efetuado com sucesso!" 
      });
    }

    // 2. UTILIZADORES COMUNS (Modelo Usuario no Prisma)
    const user = await (prisma as any).usuario.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    // CORREÇÃO AQUI: trocado de user.password para user.senha
    const senhaValida = await bcrypt.compare(password, user.senha);
    
    if (!senhaValida) {
      return NextResponse.json(
        { message: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "segredo_ifma_2026",
      { expiresIn: "1d" }
    );

    return NextResponse.json({ token, message: "Login efetuado com sucesso!" });

  } catch (error: any) {
    console.error("🚨 ERRO DETALHADO NO LOGIN:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor", error: error.message },
      { status: 500 }
    );
  }
}