import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth-user');
  const isUserAuthenticated = authCookie?.value ? JSON.parse(authCookie.value) : null;
  const isAuthPage = request.nextUrl.pathname === '/sign-in' || request.nextUrl.pathname === '/sign-up' || request.nextUrl.pathname === '/sales';

  if (isUserAuthenticated) {
    if (isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else if (!isAuthPage) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};