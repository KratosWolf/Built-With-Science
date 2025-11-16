'use client';

/**
 * Login Page with Email/Password and Google OAuth
 *
 * GOOGLE OAUTH SETUP:
 * If Google login is not working, see GOOGLE_OAUTH_SETUP.md in the project root
 * for step-by-step configuration instructions.
 */

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Debug log
  console.log('🔍 LoginPage - signInWithGoogle disponível:', typeof signInWithGoogle);
  console.log('🔍 LoginPage - user:', user?.email || 'não logado');

  const handleGoogleSignIn = async () => {
    console.log('🔵 [1] handleGoogleSignIn CHAMADO');
    try {
      console.log('🔵 [2] Setando isGoogleLoading = true');
      setIsGoogleLoading(true);
      setError('');

      console.log('🔵 [3] Verificando signInWithGoogle:', typeof signInWithGoogle);
      if (!signInWithGoogle) {
        throw new Error('signInWithGoogle não está disponível');
      }

      console.log('🔵 [4] Chamando signInWithGoogle()...');
      const result = await signInWithGoogle();
      console.log('🔵 [5] Resultado do signInWithGoogle:', result);

      // Redirect é automático via Supabase
    } catch (err: any) {
      console.error('❌ [ERROR] Google sign in error:', err);
      console.error('❌ [ERROR] Error message:', err.message);
      console.error('❌ [ERROR] Error stack:', err.stack);
      setError(err.message || 'Erro ao fazer login com Google');
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🔐 [LOGIN] Form submitted');
    console.log('🔐 [LOGIN] Email:', email);
    console.log('🔐 [LOGIN] Password length:', password.length);

    // Validations
    if (!email || !password) {
      console.warn('⚠️ [LOGIN] Validation failed: empty fields');
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      console.warn('⚠️ [LOGIN] Validation failed: password too short');
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      console.log('🔐 [LOGIN] Calling signIn...');
      await signIn(email, password);
      console.log('✅ [LOGIN] Login successful, redirecting...');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('❌ [LOGIN] Login error caught:');
      console.error('   - Error object:', err);
      console.error('   - Error message:', err.message);
      console.error('   - Error status:', err.status);
      console.error('   - Error code:', err.code);
      console.error('   - Error name:', err.name);
      console.error('   - Full error:', JSON.stringify(err, null, 2));

      // Handle common Supabase errors
      if (err.message?.includes('Invalid login credentials')) {
        console.error('   → Erro: Credenciais inválidas');
        setError('Email ou senha incorretos');
      } else if (err.message?.includes('Email not confirmed')) {
        console.error('   → Erro: Email não confirmado');
        setError('Por favor, confirme seu email antes de fazer login');
      } else {
        console.error('   → Erro: Desconhecido');
        setError(`Erro ao fazer login: ${err.message || 'Tente novamente'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🏋️ Built With Science
          </h1>
          <p className="text-gray-400">
            Science-based workout tracker
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-[#161b22] border-[#30363d]">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Login</CardTitle>
            <CardDescription className="text-gray-400">
              Entre com sua conta para acessar seus treinos
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-md p-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-900 border border-[#30363d] rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continuar com Google
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#30363d]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#161b22] text-gray-400">ou</span>
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">
                  📧 Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition"
                  disabled={loading}
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-300">
                  🔑 Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition"
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-medium py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>

              {/* Links */}
              <div className="space-y-2 pt-4 text-center">
                <Link
                  href="/reset-password"
                  className="block text-sm text-[#10b981] hover:underline"
                >
                  Esqueci minha senha
                </Link>

                <div className="text-sm text-gray-400">
                  Não tem uma conta?{' '}
                  <Link
                    href="/signup"
                    className="text-[#10b981] hover:underline font-medium"
                  >
                    Criar conta
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Built with Next.js and Supabase</p>
        </div>
      </div>
    </div>
  );
}
