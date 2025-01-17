// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')
  const isLoginPage = request.nextUrl.pathname === '/login'
  
  if (!authToken && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (authToken && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
            '/login', 
            '/dashboard', 
            '/users', 
            '/permissions', 
            '/roles', 
            '/settings', 
            '/teams', 
            '/vouchers',
          ]
}
