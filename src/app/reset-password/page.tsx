'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSuccess(false);

    // Validations
    if (!email) {
      setError('Por favor, insira seu email');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Por favor, insira um email válido');
      setLoading(false);
      return;
    }

    try {
      await resetPassword(email);
      console.log('✅ Password reset email sent');
      setSuccess(true);
    } catch (err: any) {
      console.error('❌ Password reset error:', err);
      setError('Erro ao enviar email. Verifique se o email está correto e tente novamente.');
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
            Recuperação de senha
          </p>
        </div>

        {/* Reset Password Card */}
        <Card className="bg-[#161b22] border-[#30363d]">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Esqueci minha senha</CardTitle>
            <CardDescription className="text-gray-400">
              Digite seu email para receber um link de recuperação
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
                        Email enviado com sucesso!
                      </p>
                      <p className="text-sm text-gray-300">
                        Enviamos um link de recuperação para <strong>{email}</strong>.
                        Verifique sua caixa de entrada e clique no link para redefinir sua senha.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => router.push('/login')}
                  className="w-full bg-[#10b981] hover:bg-[#059669] text-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para Login
                </Button>
              </div>
            ) : (
              // Reset Password Form
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-md p-3">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {/* Info Message */}
                <div className="bg-blue-500/10 border border-blue-500/50 rounded-md p-3">
                  <p className="text-sm text-blue-300">
                    💡 Você receberá um email com instruções para redefinir sua senha.
                  </p>
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
                    autoFocus
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
                      Enviando...
                    </>
                  ) : (
                    'Enviar Link de Recuperação'
                  )}
                </Button>

                {/* Link to Login */}
                <div className="pt-4 text-center">
                  <Link
                    href="/login"
                    className="text-sm text-[#10b981] hover:underline inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Voltar para login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <Card className="bg-[#161b22] border-[#30363d] p-4">
            <p className="text-sm text-gray-400 mb-2">
              Não recebeu o email?
            </p>
            <p className="text-xs text-gray-500">
              Verifique sua caixa de spam ou aguarde alguns minutos.
              Se o problema persistir,{' '}
              <Link href="/signup" className="text-[#10b981] hover:underline">
                crie uma nova conta
              </Link>
              .
            </p>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Built with Next.js and Supabase</p>
        </div>
      </div>
    </div>
  );
}
