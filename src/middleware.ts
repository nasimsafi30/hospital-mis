import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  const publicRoutes = ['/login', '/register', '/forgot-password', '/api/login'];
  if (publicRoutes.includes(pathname) || pathname.startsWith('/api/login')) {
    return NextResponse.next();
  }

  // Allow all API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Check for dashboard access - look for token in localStorage is client-side only
  // For middleware, we just let it through and the layout will check
  if (pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
    '/login',
  ],
};