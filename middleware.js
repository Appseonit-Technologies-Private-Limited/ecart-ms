import { parse } from 'cookie';
import { NextResponse } from 'next/server';
import { verifyToken } from './middleware/VerifyToken';
import { isAdminPage, isProtectedPage } from './utils/util';

export async function middleware(request) {
  //console.log('MIDDLEWARE ACTIVATED....');
 
  const path = request.nextUrl.pathname
  const isAdminPath = admin_URIs.indexOf(path) !== -1;
  const adminIdArr = process.env.NEXT_PUBLIC_ADMIN_IDS ? process.env.NEXT_PUBLIC_ADMIN_IDS.split(',') : [];

  const isPublicPath = public_URIs.indexOf(path) !== -1;
  if (isPublicPath) return NextResponse.next();

  // Extract cookies from request headers
  const cookies = parse(request.headers.get('cookie') || '');

  const accessToken = cookies && cookies.com1 || '';
  try {
    // Verify the access token
    const decodedAccessToken = await verifyToken(accessToken, process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET);
    if(decodedAccessToken.err) throw new Error(decodedAccessToken.err);   
    if(isProtectedPage(path, protected_URIs)){      
      return NextResponse.next();
    }else if (isAdminPage(isAdminPath, adminIdArr, decodedAccessToken)){
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/unauthorized', request.nextUrl));   
  } catch (error) {
    console.log('ERROR getting access token:', error);
    // Access token is invalid or expired, redirect to refresh endpoint
    const refreshToken = cookies.refreshToken || '';
    if (refreshToken) {
      // Redirect to refresh token endpoint to get a new access token
      getData('auth/accessToken').then(res => {
        if (res && res.access_token) {
          if(isProtectedPage(path, protected_URIs)){            
            return NextResponse.redirect(new URL(request.nextUrl, request.nextUrl));
          }else if (isAdminPage(isAdminPath, adminIdArr, decodedAccessToken)){      
            return NextResponse.redirect(new URL(request.nextUrl, request.nextUrl));
          }
          return NextResponse.redirect(new URL('/unauthorized', request.nextUrl)); 
        }
      });
    }
  }
  //Default to signin page for accessToken and refreshToken not available at any moment.
  return NextResponse.redirect(new URL('/signin', request.nextUrl))
}

const public_URIs = ['/', '/signin', '/register', '/cart', '/contactus'];
const protected_URIs = ['/orders', '/profile', '/productSearch', '/notifications', '/product/[slug]'];
const admin_URIs = ['/users', '/productList', '/categories', '/dashboard'];

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
    '/product/[slug]'
  ]
}