-- ============================================
-- MIGRATION: Create Goals Table
-- ============================================
-- Execute no Supabase Dashboard: SQL Editor
-- Cria tabela de metas para usuários
-- ============================================

-- Tabela de metas
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'workouts', 'volume', 'frequency'
  target_value INTEGER NOT NULL,
  period_days INTEGER NOT NULL, -- 30, 90, 365
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, type, period_days)
);

-- RLS (Row Level Security)
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Policies: Usuários só veem suas próprias metas
CREATE POLICY "Users can view own goals"
  ON goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE
  USING (auth.uid() = user_id);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_goals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION update_goals_updated_at();

-- Inserir metas padrão para testing (opcional)
-- SUBSTITUA 'SEU_USER_ID' pelo seu ID real
-- Exemplo:
-- INSERT INTO goals (user_id, type, target_value, period_days) VALUES
--   ('SEU_USER_ID', 'workouts', 12, 30),
--   ('SEU_USER_ID', 'volume', 10000, 30),
--   ('SEU_USER_ID', 'frequency', 3, 30);

-- Verificar criação
SELECT * FROM goals;

-- ============================================
-- FIM DA MIGRATION
-- ============================================
