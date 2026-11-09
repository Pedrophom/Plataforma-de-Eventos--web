import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Tenta procurar o nosso "crachá" (o token JWT) guardado nos cookies
  const token = request.cookies.get('auth_token')?.value;

  // 2. Descobre qual é a página que o utilizador está a tentar aceder
  const pathname = request.nextUrl.pathname;

  // 3. Define quais são as páginas em que qualquer pessoa pode entrar sem login
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // 4. Regra de Bloqueio: Se NÃO tem token e a página NÃO é pública -> Vai para o /login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 5. Regra de Conforto: Se JÁ tem token e tenta entrar no /login -> Vai para o Painel (/)
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Se passar por todas as regras, permite que a página carregue normalmente
  return NextResponse.next();
}

// 6. Otimização: Define em quais rotas o middleware DEVE ou NÃO DEVE atuar
export const config = {
  matcher: [
    /*
     * Aplica o middleware em TODAS as rotas, EXCETO:
     * - /api/... (Deixa a API livre para o aplicativo Mobile conseguir consumir)
     * - /_next/... (Ficheiros estáticos do sistema Next.js)
     * - favicon.ico (O ícone do site)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};