import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔐 [CALLBACK] URL completa:', request.url);
  console.log('🔐 [CALLBACK] Path:', requestUrl.pathname);
  console.log('🔐 [CALLBACK] Query params:', requestUrl.searchParams.toString());
  console.log('🔐 [CALLBACK] Code:', code ? `present (${code.substring(0, 20)}...)` : 'MISSING');
  console.log('🔐 [CALLBACK] All params:', Array.from(requestUrl.searchParams.entries()));

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('❌ Error exchanging code for session:', error);
        return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
      }

      console.log('✅ Session exchanged successfully:', data.user?.email);
    } catch (error) {
      console.error('❌ Exception during code exchange:', error);
      return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
    }
  }

  // Redirect para dashboard após login
  console.log('✅ Redirecting to dashboard');
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
