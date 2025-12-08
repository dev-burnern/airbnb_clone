import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /api/ 요청을 /backend/api/ 로 리다이렉트
  if (pathname.startsWith('/api/')) {
    const newPathname = pathname.replace(/^\/api/, '/backend/api');
    return NextResponse.rewrite(new URL(newPathname, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
