import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { email, senha } = await req.json();

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 401 });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    return NextResponse.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email } });
  } catch (error) {
    return NextResponse.json({ error: 'Erro no servidor.' }, { status: 500 });
  }
}