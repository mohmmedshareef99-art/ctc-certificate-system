import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for admin auth cookie or Supabase auth token cookie
  const authCookie = request.cookies.get('ctc_admin_auth');
  const supabaseToken = Array.from(request.cookies.getAll()).find((c) =>
    c.name.includes('auth-token')
  );

  const isAuthenticated = Boolean(authCookie?.value || supabaseToken?.value);

  // Protected route check: /admin and subroutes
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated user away from /login to /admin
  if (pathname === '/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
