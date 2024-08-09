import { NextRequest, NextResponse } from 'next/server' 

export function middleware(NextRequest) {
  const path = request.nextUrl.pathname

  const isPublicPath = public_paths.indexOf(path) !== -1;

  const token = request.cookies.get('token')?.value || ''

  if(isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/signin', request.nextUrl))
  }
    
}

const public_paths = ['/', '/signin', '/register', '/cart'];

 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/cart',
    '/signin',
    '/register',
    '/profile',
    '/productSearch',
    '/users',
    '/productList',
    '/orders',
    '/notifications',
    '/dashboard',
    '/categories',
    '/product/*'
  ]
}