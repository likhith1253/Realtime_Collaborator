import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of protected routes
const protectedRoutes = ['/dashboard', '/projects', '/documents', '/canvas']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // If it's a protected route, check for auth token
  if (isProtectedRoute) {
    const token = request.cookies.get('auth_token')?.value

    // If no token, redirect to sign-in
    if (!token) {
      const signInUrl = new URL('/auth/sign-in', request.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  // Allow the request to proceed
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (auth pages)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ],
}
