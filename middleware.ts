import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
export async function middleware(request: NextRequest) {
    const response = await updateSession(request);
    // using the cookies in middlewear
  const token = request.cookies.get('access_token') 
  
  const pathname = request.nextUrl.pathname

      

    const authRoutes = ["/login", "/signup"];
  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token && (
    pathname.startsWith('/staff') || 
    pathname.startsWith('/admin')
  )) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  return response;
  
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/staff/:path*',
    '/login',
    '/signup',
  ]
}