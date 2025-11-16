"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { getDashboardData, type DashboardData } from '@/app/actions/dashboard'
import { getGoalsProgress } from '@/app/actions/goals'
import { GoalProgress } from '@/types/goals'
import { TimeSelector } from '@/components/ui/time-selector'
import { ActivityCalendar } from '@/components/ui/activity-calendar'
import { GoalCard } from '@/components/dashboard/goal-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AnimatedNumber } from '@/components/ui/animated-number'
import { ComparisonBadge } from '@/components/ui/comparison-badge'
import Link from 'next/link'
import { Activity, TrendingUp, Calendar, Flame, Loader2 } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState(30)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [goalsProgress, setGoalsProgress] = useState<GoalProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('❌ User not authenticated, redirecting to login')
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Fetch dashboard data when period changes
  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true)
      setError(null)

      try {
        console.log('🔄 Fetching dashboard data for period:', selectedPeriod)
        const data = await getDashboardData(selectedPeriod)
        console.log('✅ Data received:', data)
        setDashboardData(data)

        // Buscar progresso das metas baseado nas stats reais
        if (data.stats) {
          console.log('🎯 Fetching goals progress...')
          const goals = await getGoalsProgress(selectedPeriod, data.stats)
          console.log('✅ Goals received:', goals)
          setGoalsProgress(goals)
        }
      } catch (err) {
        console.error('❌ Error fetching dashboard data:', err)
        setError('Falha ao carregar dados do dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [selectedPeriod])

  // Use real data or show empty state
  const stats = dashboardData?.stats || {
    totalWorkouts: 0,
    currentStreak: 0,
    totalVolume: 0,
    avgWorkoutsPerWeek: 0,
  }
  const comparison = dashboardData?.comparison
  const workouts = dashboardData?.workouts || []

  // Show loading state while checking authentication
  if (authLoading || (isLoading && !error)) {
    return (
      <main className="min-h-screen bg-[#0d1117] text-gray-100">
        <div className="border-b border-[#30363d] bg-[#0d1117]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <motion.div
              className="h-10 w-48 bg-[#161b22] rounded animate-pulse"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="h-32 bg-[#161b22] rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: [0.5, 1, 0.5], y: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
          <motion.div
            className="h-64 bg-[#161b22] rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </main>
    )
  }

  // Show error state
  if (error) {
    return (
      <main className="min-h-screen bg-[#0d1117] text-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="text-red-500 text-5xl">⚠️</div>
          <h2 className="text-xl font-semibold text-white">Erro ao carregar dados</h2>
          <p className="text-gray-400">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#10b981] hover:bg-[#059669] text-white"
          >
            Tentar Novamente
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0d1117] text-gray-100">
      {/* Header */}
      <div className="border-b border-[#30363d] bg-[#0d1117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400 mt-1">
                {user ? `Bem-vindo, ${user.user_metadata?.name || user.email}` : 'Acompanhe seu progresso e estatísticas'}
              </p>
            </div>

            {/* TimeSelector - Responsivo */}
            <TimeSelector
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Total Workouts Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0 }}
            whileHover={{
              scale: 1.02,
              boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)'
            }}
          >
            <Card className="bg-[#0d1117] border-[#30363d] hover:border-[#10b981] transition-colors h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Total de Treinos
                </CardTitle>
                <Activity className="h-4 w-4 text-[#10b981]" />
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-3">
                  <div className="text-3xl font-bold text-white">
                    <AnimatedNumber value={stats.totalWorkouts} />
                  </div>
                  {comparison && (
                    <ComparisonBadge
                      changePercent={comparison.totalWorkouts.changePercent}
                      isIncrease={comparison.totalWorkouts.isIncrease}
                    />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {comparison && `vs ${comparison.totalWorkouts.previous} no período anterior`}
                  {!comparison && (selectedPeriod === 30 ? 'Último mês' : selectedPeriod === 90 ? 'Últimos 3 meses' : 'Último ano')}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Current Streak Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{
              scale: 1.02,
              boxShadow: '0 10px 30px rgba(245, 158, 11, 0.2)'
            }}
          >
            <Card className="bg-[#0d1117] border-[#30363d] hover:border-[#f59e0b] transition-colors h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Sequência Atual
                </CardTitle>
                <Flame className="h-4 w-4 text-[#f59e0b]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  <AnimatedNumber value={stats.currentStreak} />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  dias consecutivos
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Total Volume Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{
              scale: 1.02,
              boxShadow: '0 10px 30px rgba(59, 130, 246, 0.2)'
            }}
          >
            <Card className="bg-[#0d1117] border-[#30363d] hover:border-[#3b82f6] transition-colors h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Volume Total
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-[#3b82f6]" />
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-3">
                  <div className="text-3xl font-bold text-white">
                    <AnimatedNumber value={parseFloat((stats.totalVolume / 1000).toFixed(1))} suffix="k" />
                  </div>
                  {comparison && (
                    <ComparisonBadge
                      changePercent={comparison.totalVolume.changePercent}
                      isIncrease={comparison.totalVolume.isIncrease}
                    />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {comparison && `vs ${(comparison.totalVolume.previous / 1000).toFixed(1)}k no período anterior`}
                  {!comparison && 'kg levantados'}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Average Workouts/Week Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{
              scale: 1.02,
              boxShadow: '0 10px 30px rgba(139, 92, 246, 0.2)'
            }}
          >
            <Card className="bg-[#0d1117] border-[#30363d] hover:border-[#8b5cf6] transition-colors h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Média Semanal
                </CardTitle>
                <Calendar className="h-4 w-4 text-[#8b5cf6]" />
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-3">
                  <div className="text-3xl font-bold text-white">
                    <AnimatedNumber value={parseFloat(stats.avgWorkoutsPerWeek.toFixed(1))} />
                  </div>
                  {comparison && (
                    <ComparisonBadge
                      changePercent={comparison.avgWorkoutsPerWeek.changePercent}
                      isIncrease={comparison.avgWorkoutsPerWeek.isIncrease}
                    />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {comparison && `vs ${comparison.avgWorkoutsPerWeek.previous.toFixed(1)} no período anterior`}
                  {!comparison && 'treinos por semana'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Activity Calendar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="bg-[#0d1117] border-[#30363d] mb-8">
            <CardHeader>
              <CardTitle className="text-white">Atividade no Período</CardTitle>
              <CardDescription className="text-gray-400">
                Visualização dos treinos nos últimos {selectedPeriod} dias
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ActivityCalendar period={selectedPeriod} workouts={workouts} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Goals Section */}
        {goalsProgress.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Card className="bg-[#0d1117] border-[#30363d] mb-8">
              <CardHeader>
                <CardTitle className="text-white">Metas do Período</CardTitle>
                <CardDescription className="text-gray-400">
                  Acompanhe seu progresso em direção às suas metas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {goalsProgress.map((goalProgress, index) => (
                    <GoalCard
                      key={goalProgress.goal.id}
                      goalProgress={goalProgress}
                      index={index}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="bg-[#0d1117] border-[#30363d]">
            <CardHeader>
              <CardTitle className="text-white">Ações Rápidas</CardTitle>
              <CardDescription className="text-gray-400">
                Continue seu progresso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild className="bg-[#10b981] hover:bg-[#059669] text-white">
                    <Link href="/programs">
                      Iniciar Novo Treino
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild variant="outline" className="border-[#30363d] text-gray-300 hover:bg-[#161b22] hover:text-white">
                    <Link href="/history">
                      Ver Histórico
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" className="border-[#30363d] text-gray-300 hover:bg-[#161b22] hover:text-white">
                    Configurações
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
