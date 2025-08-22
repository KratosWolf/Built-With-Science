# Built With Science - Comprehensive Project Context

## Project Overview
Built With Science é uma aplicação de tracking de exercícios baseada em ciência, com dois projetos em desenvolvimento paralelo:

### 🌐 **Next.js Web Version** (Esta pasta)
Aplicação web avançada com interface completa de workout tracking

### 📱 **Flutter Mobile Version** 
Aplicação mobile nativa em `/Users/tiagofernandes/built_with_science_app`

---

## 🚨 SITUAÇÃO ATUAL (22 Aug 2025)

### **DECISÃO ESTRATÉGICA**: Migrar para Flutter como projeto principal
**Motivo**: App será usado principalmente no celular para tracking durante treinos

### **STATUS DOS PROJETOS:**

#### Next.js Version (Muito Avançado)
- **Localização**: `/Users/tiagofernandes/Desktop/VIBE/Built-With-Science`
- **Branch**: `feature/csv-data-integration`
- **Último Commit Local**: `6c70ccb` - Exercise interface simplification
- **Status GitHub**: ⚠️ **DESATUALIZADO** - GitHub tem apenas 2 commits básicos
- **Progresso Local**: 14+ commits não sincronizados

#### Flutter Version (Estrutura Sólida)
- **Localização**: `/Users/tiagofernandes/built_with_science_app`
- **Status Git**: Não é repositório git ainda
- **Database**: Supabase configurado
- **Estado**: Projeto inicial com estrutura completa

---

## 📊 FEATURES DESENVOLVIDAS

### Next.js (Web) - Funcionalidades Avançadas ✅
- ✅ Sistema completo de workout tracking
- ✅ Interface de exercícios com videos YouTube
- ✅ Componentes de progressão inteligente
- ✅ Rest timer funcional
- ✅ Programas 3/4/5 dias completos
- ✅ Integração real de dados CSV
- ✅ Interface responsiva
- ✅ Navegação entre workouts
- ✅ Tracking de sets/reps/peso

### Flutter (Mobile) - Base Estrutural ✅
- ✅ Modelos de dados completos baseados nos CSVs
- ✅ Configuração Supabase
- ✅ Estrutura de telas (Home, Programs, Program Detail)
- ✅ Sistema de autenticação preparado
- ✅ Mock data organizado
- ✅ Arquitetura de workout sessions
- ✅ Sistema de cache de últimas séries

---

## 🛠️ TECH STACKS

### Next.js Web
- Next.js 14 + App Router
- TypeScript
- Tailwind CSS + Shadcn/ui
- Neon PostgreSQL (não conectado)
- Mock data local

### Flutter Mobile  
- Flutter 3.5.4 + Dart
- Supabase (configurado)
- Material Design 3
- SQLite local + Supabase sync
- Arquitetura completa de dados

---

## 📋 PLANO DE MIGRAÇÃO PARA FLUTTER

### Fase 1: Organização e Backup
- [x] Documentar estado completo dos projetos
- [x] Sincronizar Next.js progress para GitHub
- [ ] Criar repositório Flutter no GitHub
- [ ] Documentar plano de migração

### Fase 2: Migração Core Features
- [ ] Migrar lógica de workout tracking do Next.js
- [ ] Implementar telas de exercício no Flutter
- [ ] Integrar dados CSV no Supabase
- [ ] Migrar componentes de progressão

### Fase 3: Mobile-Specific Features
- [ ] Rest timer otimizado para mobile
- [ ] Interface touch-friendly
- [ ] Modo offline funcional
- [ ] Notificações para descanso

---

## 🔧 COMANDOS ÚTEIS

### Next.js
```bash
cd "/Users/tiagofernandes/Desktop/VIBE/Built-With-Science"
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run lint         # Linting
npm run type-check   # TypeScript check
```

### Flutter
```bash
cd "/Users/tiagofernandes/built_with_science_app"
flutter run          # Executar app
flutter build apk    # Build Android
flutter test         # Testes
flutter clean        # Limpar build
```

---

## 📁 ESTRUTURAS DE DIRETÓRIOS

### Next.js Structure
```
src/
├── app/
│   ├── programs/[id]/days/[dayId]/page.tsx  # Workout tracking
│   ├── programs/[id]/page.tsx               # Program details
│   └── programs/page.tsx                    # Programs list
├── components/ui/                           # UI components
├── lib/mock-data/workout-data.ts           # Dados CSV integrados
└── types/                                   # Type definitions
```

### Flutter Structure
```
lib/
├── models/workout_models.dart              # Modelos completos
├── data/mock_data.dart                     # Mock data CSV
├── screens/                                # Telas principais
│   ├── home_screen.dart
│   ├── programs_screen.dart
│   └── program_detail_screen.dart
└── main.dart                               # App principal
```

---

## 🎯 PRÓXIMOS PASSOS PRIORITÁRIOS

1. **Sincronizar progresso Next.js no GitHub** ⚠️
2. **Inicializar repositório Flutter no GitHub**
3. **Começar migração de features core**
4. **Configurar Supabase com dados reais**
5. **Implementar workout tracking no Flutter**

---

## 📝 NOTAS IMPORTANTES

- **Foco principal**: Flutter para uso mobile pessoal
- **Next.js**: Manter como referência e possível versão web futura
- **Database**: Supabase para sincronização cross-device
- **Dados**: CSVs já integrados no Next.js, prontos para migração

---

## 🚨 LEMBRETES

- ⚠️ **GitHub desatualizado** - sincronizar antes de continuar
- 📱 **Objetivo final**: App funcional no celular para tracking
- 🔄 **Backup**: Garantir que nada seja perdido na migração
- 📚 **Documentação**: Manter tudo bem documentado para futuras sessões