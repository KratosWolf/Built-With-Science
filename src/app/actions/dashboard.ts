'use server'

import { supabase } from '@/lib/supabase'
import { subDays, format, parseISO, startOfDay, differenceInDays } from 'date-fns'
import type { PeriodComparison } from '@/types/dashboard'

export interface DashboardData {
  stats: {
    totalWorkouts: number
    currentStreak: number
    totalVolume: number
    avgWorkoutsPerWeek: number
  }
  comparison?: {
    totalWorkouts: PeriodComparison
    totalVolume: PeriodComparison
    avgWorkoutsPerWeek: PeriodComparison
  }
  workouts: Array<{
    date: string
    count: number
  }>
}

export async function getDashboardData(days: number): Promise<DashboardData> {
  try {
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('❌ Usuário não autenticado:', authError)
      throw new Error('Não autenticado')
    }

    const userId = user.id
    console.log('✅ Usuário autenticado:', userId)

    const endDate = new Date()
    const startDate = subDays(endDate, days)

    console.log('🔍 Buscando workouts para:', {
      userId,
      days,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    })

    // Buscar workout_sets (não workout_sessions)
    const { data: workouts, error } = await supabase
      .from('workout_sets')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Erro ao buscar workouts:', error)
      throw error
    }

    console.log('✅ Workouts encontrados:', workouts?.length || 0)
    if (workouts && workouts.length > 0) {
      console.log('📊 Primeiro workout (estrutura completa):', workouts[0])
      console.log('📋 Campos disponíveis:', Object.keys(workouts[0]))
    }

    if (!workouts || workouts.length === 0) {
      console.log('⚠️ Retornando dados vazios')
      return {
        stats: {
          totalWorkouts: 0,
          currentStreak: 0,
          totalVolume: 0,
          avgWorkoutsPerWeek: 0
        },
        workouts: []
      }
    }

    const stats = calculateStats(workouts, days)
    const calendarData = groupByDate(workouts)

    // Buscar dados do período anterior para comparação
    const previousEndDate = startDate
    const previousStartDate = subDays(previousEndDate, days)

    const { data: previousWorkouts } = await supabase
      .from('workout_sets')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', previousStartDate.toISOString())
      .lt('created_at', previousEndDate.toISOString())

    const previousStats = calculateStats(previousWorkouts || [], days)

    // Calcular comparações
    const comparison = {
      totalWorkouts: createComparison(stats.totalWorkouts, previousStats.totalWorkouts),
      totalVolume: createComparison(stats.totalVolume, previousStats.totalVolume),
      avgWorkoutsPerWeek: createComparison(stats.avgWorkoutsPerWeek, previousStats.avgWorkoutsPerWeek)
    }

    console.log('📈 Stats calculados:', stats)
    console.log('📊 Comparação:', comparison)
    console.log('📅 Dados do calendário:', calendarData)

    return { stats, comparison, workouts: calendarData }

  } catch (error) {
    console.error('❌ Erro em getDashboardData:', error)
    return {
      stats: {
        totalWorkouts: 0,
        currentStreak: 0,
        totalVolume: 0,
        avgWorkoutsPerWeek: 0
      },
      workouts: []
    }
  }
}

function calculateStats(workouts: any[], days: number) {
  const totalWorkouts = workouts.length
  const currentStreak = calculateStreak(workouts)

  // Se não tiver total_points, usar 100 por workout
  const totalVolume = workouts.reduce((sum, w) => {
    return sum + (w.total_points || 100)
  }, 0)

  const avgWorkoutsPerWeek = (totalWorkouts / days) * 7

  return {
    totalWorkouts,
    currentStreak,
    totalVolume,
    avgWorkoutsPerWeek: Math.round(avgWorkoutsPerWeek * 10) / 10
  }
}

function calculateStreak(workouts: any[]): number {
  if (workouts.length === 0) return 0

  // Extrair datas únicas e ordenar do mais recente para o mais antigo
  const uniqueDates = Array.from(
    new Set(
      workouts.map(w => format(startOfDay(parseISO(w.created_at)), 'yyyy-MM-dd'))
    )
  ).sort((a, b) => b.localeCompare(a))

  const today = startOfDay(new Date())
  const yesterday = subDays(today, 1)

  // Verificar se treinou hoje ou ontem
  const lastWorkoutDate = startOfDay(parseISO(workouts[0].created_at))
  const daysSinceLastWorkout = differenceInDays(today, lastWorkoutDate)

  console.log('🔥 Calculando streak:', {
    today: format(today, 'yyyy-MM-dd'),
    lastWorkout: format(lastWorkoutDate, 'yyyy-MM-dd'),
    daysSince: daysSinceLastWorkout,
    uniqueDates
  })

  if (daysSinceLastWorkout > 1) {
    console.log('❌ Streak quebrado - último treino foi há mais de 1 dia')
    return 0
  }

  let streak = 1
  let currentDate = lastWorkoutDate

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = startOfDay(parseISO(uniqueDates[i]))
    const diff = differenceInDays(currentDate, prevDate)

    console.log(`  Comparando: ${format(currentDate, 'yyyy-MM-dd')} -> ${format(prevDate, 'yyyy-MM-dd')} (diff: ${diff})`)

    if (diff === 1) {
      streak++
      currentDate = prevDate
    } else if (diff > 1) {
      console.log(`  ⛔ Gap de ${diff} dias - parando contagem`)
      break
    }
  }

  console.log(`✅ Streak final: ${streak} dias`)
  return streak
}

function groupByDate(workouts: any[]) {
  const grouped = new Map<string, number>()

  workouts.forEach(workout => {
    const date = format(parseISO(workout.created_at), 'yyyy-MM-dd')
    grouped.set(date, (grouped.get(date) || 0) + 1)
  })

  const result = Array.from(grouped.entries()).map(([date, count]) => ({
    date,
    count
  }))

  console.log('📊 Agrupamento por data:', result)
  return result
}

function createComparison(current: number, previous: number): PeriodComparison {
  const change = current - previous
  const changePercent = previous === 0
    ? (current > 0 ? 100 : 0)
    : ((change / previous) * 100)

  return {
    current,
    previous,
    change,
    changePercent,
    isIncrease: change > 0,
  }
}

/**
 * Get mock user ID for testing
 * Returns a fixed user ID for now
 */
export async function getMockUserId(): Promise<string> {
  return '8bcb4e6c-b769-47ab-9a5f-960e7c097d71'
}
