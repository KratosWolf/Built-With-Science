'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function TestAuth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult(null)

    try {
      console.log('🔍 TESTE 1: Verificando configuração Supabase...')
      console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('ANON_KEY (primeiros 20 chars):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...')

      // Teste de conexão básica
      const { data: healthData, error: healthError } = await supabase
        .from('workout_sets')
        .select('count')
        .limit(1)

      if (healthError) {
        console.error('❌ Erro de conexão:', healthError)
        setResult({
          type: 'connection_error',
          error: healthError,
          message: 'Erro ao conectar com Supabase'
        })
        setLoading(false)
        return
      }

      console.log('✅ Conexão com Supabase OK')

      // Testar autenticação
      if (!email || !password) {
        setResult({
          type: 'info',
          message: 'Digite email e senha para testar autenticação'
        })
        setLoading(false)
        return
      }

      console.log('🔍 TESTE 2: Tentando autenticar...')
      console.log('Email:', email)
      console.log('Password length:', password.length)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('📊 Resposta completa do Supabase:')
      console.log('Data:', JSON.stringify(data, null, 2))
      console.log('Error:', JSON.stringify(error, null, 2))

      if (error) {
        console.error('❌ Erro de autenticação:', error)
        setResult({
          type: 'auth_error',
          error: error,
          errorCode: error.status,
          errorMessage: error.message,
          errorName: error.name,
          fullError: JSON.stringify(error, null, 2)
        })
      } else {
        console.log('✅ Autenticação bem-sucedida!')
        console.log('User:', data.user)
        console.log('Session:', data.session)
        setResult({
          type: 'success',
          data: data,
          user: data.user,
          session: data.session
        })
      }
    } catch (err: any) {
      console.error('❌ Exceção capturada:', err)
      setResult({
        type: 'exception',
        error: err,
        message: err.message,
        stack: err.stack
      })
    } finally {
      setLoading(false)
    }
  }

  const checkUser = async () => {
    setLoading(true)
    setResult(null)

    try {
      console.log('🔍 TESTE 3: Verificando sessão atual...')

      const { data: { session }, error } = await supabase.auth.getSession()

      console.log('Session:', session)
      console.log('Error:', error)

      if (error) {
        setResult({
          type: 'session_error',
          error: error
        })
      } else if (session) {
        setResult({
          type: 'session_found',
          session: session,
          user: session.user
        })
      } else {
        setResult({
          type: 'no_session',
          message: 'Nenhuma sessão ativa encontrada'
        })
      }
    } catch (err: any) {
      setResult({
        type: 'exception',
        error: err
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-[#161b22] border-[#30363d]">
          <CardHeader>
            <CardTitle className="text-white">🔍 Teste de Autenticação Supabase</CardTitle>
            <CardDescription className="text-gray-400">
              Diagnóstico detalhado de autenticação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Configuração */}
            <div className="p-4 bg-[#0d1117] rounded border border-[#30363d]">
              <h3 className="font-semibold text-white mb-2">Configuração Atual:</h3>
              <div className="text-sm space-y-1 font-mono">
                <div className="text-gray-400">
                  <span className="text-green-400">URL:</span>{' '}
                  {process.env.NEXT_PUBLIC_SUPABASE_URL}
                </div>
                <div className="text-gray-400">
                  <span className="text-green-400">ANON_KEY:</span>{' '}
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 30)}...
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email:
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="bg-[#0d1117] border-[#30363d] text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Senha:
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••"
                  className="bg-[#0d1117] border-[#30363d] text-white"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <Button
                onClick={testConnection}
                disabled={loading}
                className="bg-[#10b981] hover:bg-[#059669] text-white"
              >
                {loading ? 'Testando...' : 'Testar Autenticação'}
              </Button>
              <Button
                onClick={checkUser}
                disabled={loading}
                variant="outline"
                className="border-[#30363d] text-gray-300 hover:bg-[#161b22]"
              >
                Verificar Sessão
              </Button>
            </div>

            {/* Resultado */}
            {result && (
              <div className="mt-6 p-4 bg-[#0d1117] rounded border border-[#30363d]">
                <h3 className="font-semibold text-white mb-3">
                  📊 Resultado do Teste:
                </h3>
                <pre className="text-xs overflow-auto max-h-96 text-gray-300 whitespace-pre-wrap">
                  {JSON.stringify(result, null, 2)}
                </pre>

                {result.type === 'auth_error' && (
                  <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded">
                    <h4 className="text-red-400 font-semibold mb-2">❌ Erro de Autenticação:</h4>
                    <div className="text-sm space-y-1">
                      <div><span className="text-red-300">Código:</span> {result.errorCode}</div>
                      <div><span className="text-red-300">Mensagem:</span> {result.errorMessage}</div>
                      <div><span className="text-red-300">Nome:</span> {result.errorName}</div>
                    </div>
                  </div>
                )}

                {result.type === 'success' && (
                  <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded">
                    <h4 className="text-green-400 font-semibold mb-2">✅ Autenticação Bem-Sucedida!</h4>
                    <div className="text-sm">
                      <div><span className="text-green-300">User ID:</span> {result.user?.id}</div>
                      <div><span className="text-green-300">Email:</span> {result.user?.email}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card className="bg-[#161b22] border-[#30363d]">
          <CardHeader>
            <CardTitle className="text-white">📝 Instruções:</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-400 space-y-2">
            <ol className="list-decimal list-inside space-y-2">
              <li>Digite o email e senha que funcionam no app Flutter</li>
              <li>Clique em "Testar Autenticação"</li>
              <li>Abra o DevTools (F12) e vá na aba Console</li>
              <li>Copie TODOS os logs que aparecem no console</li>
              <li>Copie o resultado que aparece acima</li>
              <li>Reporte ambos para diagnóstico</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
