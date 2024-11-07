import { parse } from 'cookie';
import { NextResponse } from 'next/server';
import { verifyToken } from './middleware/VerifyToken';
import { isAdminPage, isProtectedPage } from './utils/util';
import { getData } from './utils/fetchData';
import { log_error, log_info } from './middleware/log';

export async function middleware(request) {
  log_info('MIDDLEWARE Routing check....');
 
  const path = request.nextUrl.pathname
  const isAdminPath = admin_URIs.indexOf(path) !== -1;
  const adminIdArr = process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(',') : [];
  log_info('Path >>>>>>>>>>>> '+ path);
  const isPublicPath = public_URIs.indexOf(path) !== -1;
  if ('/signin' !== path && isPublicPath) return NextResponse.next();

  // Extract cookies from request headers
  const cookies = parse(request.headers.get('cookie') || '');

  const accessToken = cookies && cookies.com1 || '';
  try {
    // Verify the access token
    const decodedAccessToken = await verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
    if(!decodedAccessToken || decodedAccessToken.err) throw new Error(decodedAccessToken ? decodedAccessToken.err : 'Unexpected access token!');   
    log_info('decodedAccessToken >>>>>>>>>>>> '+ JSON.stringify(decodedAccessToken));

    if('/signin' === path) return NextResponse.redirect(new URL('/', request.nextUrl));
    else if(isProtectedPage(path, protected_URIs)) return NextResponse.next();
    else if (isAdminPage(isAdminPath, adminIdArr, decodedAccessToken)) return NextResponse.next();
    return NextResponse.redirect(new URL('/unauthorized', request.nextUrl));   
  } catch (error) {
    log_info('ERROR getting access token:'+ error);
    // Access token is invalid or expired, redirect to refresh endpoint
    // const refreshToken = cookies.com2 || '';
    // if (refreshToken) {
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
      }).catch(err => {
        log_error('Error occurred while getting new access token: ', err);
        return NextResponse.redirect(new URL('/signin', request.nextUrl));  // Redirect to signin page
      });
    // }else{
    //   return NextResponse.redirect(new URL('/signin', request.nextUrl));  // Redirect to signin page
    // }
  }
}

const public_URIs = ['/', '/signin', '/register', '/productSearch', '/cart', '/contactus'];
const protected_URIs = ['/orders', '/profile',  '/notifications', '/product/[slug]'];
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