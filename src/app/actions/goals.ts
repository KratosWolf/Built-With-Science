'use server'

import { supabase } from '@/lib/supabase'
import { Goal, GoalType, GoalProgress } from '@/types/goals'
import { subDays, format, parseISO } from 'date-fns'

/**
 * Busca metas do usuário e calcula progresso
 * Usa metas mock se tabela não existir
 */
export async function getGoalsProgress(
  periodDays: number,
  stats: { totalWorkouts: number; totalVolume: number; avgWorkoutsPerWeek: number }
): Promise<GoalProgress[]> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log('⚠️ Usuário não autenticado para metas')
      return []
    }

    // Tentar buscar metas do banco
    const { data: goalsFromDB, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('period_days', periodDays)

    let goals: Goal[]

    // Se tabela não existir ou não houver metas, usar metas padrão
    if (error || !goalsFromDB || goalsFromDB.length === 0) {
      console.log('📝 Usando metas padrão (tabela não existe ou vazia)')

      // Metas padrão baseadas no período
      const defaultGoals = {
        30: [
          { type: 'workouts' as GoalType, target: 12 },
          { type: 'volume' as GoalType, target: 10000 },
          { type: 'frequency' as GoalType, target: 3 },
        ],
        90: [
          { type: 'workouts' as GoalType, target: 36 },
          { type: 'volume' as GoalType, target: 30000 },
          { type: 'frequency' as GoalType, target: 3 },
        ],
        365: [
          { type: 'workouts' as GoalType, target: 150 },
          { type: 'volume' as GoalType, target: 120000 },
          { type: 'frequency' as GoalType, target: 3 },
        ],
      }

      const defaults = defaultGoals[periodDays as keyof typeof defaultGoals] || defaultGoals[30]

      goals = defaults.map(g => ({
        id: `mock-${g.type}-${periodDays}`,
        user_id: user.id,
        type: g.type,
        target_value: g.target,
        period_days: periodDays,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))
    } else {
      goals = goalsFromDB as Goal[]
    }

    // Calcular progresso baseado nas stats reais
    return goals.map(goal => {
      let currentValue = 0

      switch (goal.type) {
        case 'workouts':
          currentValue = stats.totalWorkouts
          break

        case 'volume':
          currentValue = stats.totalVolume
          break

        case 'frequency':
          currentValue = stats.avgWorkoutsPerWeek
          break
      }

      const progressPercent = Math.min(
        Math.round((currentValue / goal.target_value) * 100),
        100
      )

      return {
        goal,
        current_value: currentValue,
        progress_percent: progressPercent,
        is_achieved: currentValue >= goal.target_value,
        remaining: Math.max(goal.target_value - currentValue, 0),
      }
    })
  } catch (error) {
    console.error('❌ Erro ao buscar metas:', error)
    return []
  }
}

/**
 * Cria ou atualiza uma meta
 * Requer tabela goals no Supabase
 */
export async function setGoal(
  type: GoalType,
  targetValue: number,
  periodDays: number
): Promise<Goal | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('❌ Usuário não autenticado')
      return null
    }

    const { data, error } = await supabase
      .from('goals')
      .upsert(
        {
          user_id: user.id,
          type,
          target_value: targetValue,
          period_days: periodDays,
        },
        {
          onConflict: 'user_id,type,period_days',
        }
      )
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao salvar meta:', error)
      return null
    }

    return data as Goal
  } catch (error) {
    console.error('❌ Erro ao criar meta:', error)
    return null
  }
}

/**
 * Deleta uma meta
 * Requer tabela goals no Supabase
 */
export async function deleteGoal(goalId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId)

    if (error) {
      console.error('❌ Erro ao deletar meta:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('❌ Erro ao deletar meta:', error)
    return false
  }
}
