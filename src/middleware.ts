import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { authRoutes, publicRoutes } from './routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isPublic = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isProfileComplete = req.auth?.user.profileComplete;

    if (isPublic) {
        return NextResponse.next();
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL('/members', nextUrl))
        }
        return NextResponse.next();
    }

    if (!isPublic && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', nextUrl))
    }

    if (isLoggedIn && !isProfileComplete && nextUrl.pathname !== '/profile-complete') {
        return NextResponse.redirect(new URL('/profile-complete', nextUrl));
    }

    return NextResponse.next();
})

/**
 * This is a regular expression that will match any URL path 
 * that does not start with /api, /_next/static, /_next/image, or favicon.ico.
 */
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}