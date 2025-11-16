import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  console.log('🔧 [MIDDLEWARE] Executando para:', req.nextUrl.pathname)

  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Get session
  const { data: { session } } = await supabase.auth.getSession()

  console.log('🔐 [MIDDLEWARE] Session:', session ? `authenticated (${session.user.email})` : 'not authenticated')

  // CSP Header
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.google.com https://accounts.google.com",
    "style-src 'self' 'unsafe-inline' https://*.google.com https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.google.com https://accounts.google.com https://www.googleapis.com",
    "frame-src 'self' https://*.google.com https://accounts.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')

  response.headers.set('Content-Security-Policy', cspHeader)
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  console.log('✅ [MIDDLEWARE] CSP e security headers aplicados')

  // Public routes
  const publicRoutes = ['/login', '/signup', '/forgot-password', '/test-auth', '/auth/callback', '/']
  const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  // Logged in trying to access login/signup
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
    console.log('✅ [MIDDLEWARE] User already logged in, redirecting to dashboard')
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Not logged in trying to access private route
  if (!session && !isPublicRoute) {
    console.log('❌ [MIDDLEWARE] No session, redirecting to login')
    return NextResponse.redirect(new URL('/login', req.url))
  }

  console.log('✅ [MIDDLEWARE] Access allowed\n')
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
