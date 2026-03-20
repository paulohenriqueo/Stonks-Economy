import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Redireciona da home para /login
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  // Permite outras rotas normalmente
  return NextResponse.next();
}

// Aplica o middleware apenas na home
export const config = {
  matcher: ['/'],
};
