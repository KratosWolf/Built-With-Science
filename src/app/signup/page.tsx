'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle, user } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    router.push('/dashboard');
    return null;
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setError('');
      console.log('🔐 Starting Google sign in...');
      await signInWithGoogle();
      // Redirect é automático via Supabase
    } catch (err: any) {
      console.error('❌ Google sign in error:', err);
      setError(err.message || 'Erro ao fazer login com Google');
      setIsGoogleLoading(false);
    }
  };

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return false;
    }

    if (name.length < 3) {
      setError('O nome deve ter pelo menos 3 caracteres');
      return false;
    }

    if (!email.includes('@')) {
      setError('Por favor, insira um email válido');
      return false;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSuccess(false);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password, name);
      console.log('✅ Sign up successful');
      setSuccess(true);

      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Optionally redirect after a few seconds
      setTimeout(() => {
        router.push('/login');
      }, 5000);
    } catch (err: any) {
      console.error('❌ Sign up error:', err);

      // Handle common Supabase errors
      if (err.message?.includes('User already registered')) {
        setError('Este email já está cadastrado');
      } else if (err.message?.includes('Password should be at least 6 characters')) {
        setError('A senha deve ter pelo menos 6 caracteres');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
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
            Crie sua conta e comece a treinar
          </p>
        </div>

        {/* Sign Up Card */}
        <Card className="bg-[#161b22] border-[#30363d]">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Criar Conta</CardTitle>
            <CardDescription className="text-gray-400">
              Preencha os dados abaixo para começar
            </CardDescription>
          </CardHeader>

          <CardContent>
            {success ? (
              // Success Message
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/50 rounded-md p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-400 mb-1">
                        Conta criada com sucesso!
                      </p>
                      <p className="text-sm text-gray-300">
                        Enviamos um email de confirmação para <strong>{email}</strong>.
                        Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => router.push('/login')}
                  className="w-full bg-[#10b981] hover:bg-[#059669] text-white"
                >
                  Ir para Login
                </Button>
              </div>
            ) : (
              // Sign Up Form
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

                {/* Name Input */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-300">
                    👤 Nome Completo
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition"
                    disabled={loading}
                  />
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
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition"
                    disabled={loading}
                  />
                  {password && password.length < 6 && (
                    <p className="text-xs text-red-400">
                      A senha deve ter pelo menos 6 caracteres
                    </p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                    🔒 Confirmar Senha
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Digite a senha novamente"
                    className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition"
                    disabled={loading}
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-400">
                      As senhas não coincidem
                    </p>
                  )}
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
                      Criando conta...
                    </>
                  ) : (
                    'Criar Conta'
                  )}
                </Button>

                {/* Link to Login */}
                <div className="pt-4 text-center text-sm text-gray-400">
                  Já tem uma conta?{' '}
                  <Link
                    href="/login"
                    className="text-[#10b981] hover:underline font-medium"
                  >
                    Fazer login
                  </Link>
                </div>
              </form>
            )}
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
