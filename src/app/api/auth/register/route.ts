// Caminho: web/src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const { nome, email, senha } = await req.json();

    const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
    if (usuarioExistente) {
      return NextResponse.json({ error: 'Email já cadastrado.' }, { status: 400 });
    }

    const hashSenha = await bcrypt.hash(senha, 10);
    
    const usuario = await prisma.usuario.create({
      data: { nome, email, senha: hashSenha }
    });

    return NextResponse.json({ id: usuario.id, nome: usuario.nome, email: usuario.email }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar usuário.' }, { status: 500 });
  }
}