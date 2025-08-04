import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // If the user is not an admin or cashier, redirect from dashboard
    if (pathname.startsWith('/dashboard') && token?.role !== 'ADMIN' && token?.role !== 'CASHIER') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // If a cashier tries to access a restricted admin page, redirect
    const isAdminOnlyRoute = pathname.startsWith('/dashboard/users') || 
                             pathname.startsWith('/dashboard/site-settings') ||
                             pathname.startsWith('/dashboard/about-management');
                             
    if (isAdminOnlyRoute && token?.role === 'CASHIER') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // User must be logged in to access middleware-protected routes
    },
  }
);

// This specifies which routes the middleware should run on
export const config = {
  matcher: ['/dashboard/:path*'],
};