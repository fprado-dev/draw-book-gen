import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth-user');
  const isUserAuthenticated = authCookie?.value ? JSON.parse(authCookie.value) : null;

  const authPages = [
    // '/sign-in', 
    // '/sign-up', 
    '/sales']; // Lista de páginas de autenticação
  // Verifica se a URL atual é uma página de autenticação ou não
  const isAuthPage = authPages.includes(request.nextUrl.pathname);

  if (isUserAuthenticated) {
    if (isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else if (!isAuthPage) {
    return NextResponse.redirect(new URL('/sales', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};