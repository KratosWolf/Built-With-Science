# PRD - Built With Science

## Visão Geral
Built With Science é um app completo para planejar e registrar treinos baseados em ciência, oferecendo programas estruturados de 3/4/5 dias, variações de exercícios com tutoriais em vídeo, tracker inteligente e sugestões de progressão de carga baseadas em heurística científica.

## Objetivos
- Objetivo principal: Facilitar o planejamento e execução de treinos baseados em evidência científica
- Objetivos secundários: 
  - Automatizar progressão de carga com IA prática
  - Oferecer programas validados cientificamente
  - Funcionar offline-first para uso na academia
  - Democratizar acesso a treinos de qualidade

## Público-Alvo
- **Praticantes de musculação**: Iniciantes a avançados
- **Personal trainers**: Profissionais que prescrevem treinos
- **Entusiastas fitness**: Pessoas que buscam treinos baseados em ciência
- **Atletas**: Que precisam de progressão estruturada

## Funcionalidades Core (MVP)
1. **Onboarding & Preferências**: Login Google, unidades (kg/lb), preferências de vídeo, agressividade de sugestão
2. **Programas 3/4/5 dias**: Escolha de programa, visualização de dias e exercícios
3. **Variações de exercícios**: Até 5 variações por exercício com tutoriais YouTube
4. **Tracker de treino**: Registrar sets, pesos, reps, RPE/dificuldade com último set pré-carregado
5. **Sugestão de carga**: IA heurística baseada em performance anterior e dificuldade percebida

## Requisitos Técnicos
- Framework: Next.js 15.x com App Router
- UI: Shadcn/ui + Tailwind CSS
- Linguagem: TypeScript
- Backend: Supabase (Postgres) com RLS ativado
- Autenticação: Google Auth via Supabase
- Dados: CSVs estruturados já prontos para importação
- Cache: Offline-first com sincronização automática
- Deploy: Vercel com CI/CD automatizado

## Estrutura de Dados
### Programas e Exercícios (Seed Data)
- **3 Programas**: 3-day, 4-day, 5-day Program
- **36 Exercícios**: De Barbell Back Squat a Weighted Step-Ups
- **78 Variações**: Com links para tutoriais YouTube
- **172 Sets**: Com targets de repetições (ex: "8-10", "6-12")

### Dados do Usuário
- **Preferências**: Unidades (kg/lb), agressividade de sugestão, preferência de vídeo
- **Sessões**: Histórico completo de treinos
- **Cache**: Último set por exercício para pré-preenchimento
- **Progressão**: Sugestões baseadas em RPE e performance anterior

## Requisitos de Segurança (OWASP Top 10)
1. **Broken Access Control**: Implementar RBAC e validação de permissões
2. **Cryptographic Failures**: HTTPS obrigatório, dados sensíveis criptografados
3. **Injection**: Validação e sanitização de inputs, prepared statements
4. **Insecure Design**: Threat modeling, princípio do menor privilégio
5. **Security Misconfiguration**: Headers de segurança, CORS configurado
6. **Vulnerable Components**: Auditoria regular de dependências
7. **Authentication Failures**: Rate limiting, senhas fortes, 2FA
8. **Data Integrity Failures**: Validação de serialização, CSRF tokens
9. **Security Logging**: Logs de segurança, monitoramento
10. **SSRF**: Validação de URLs, whitelist de domínios

## Métricas de Sucesso
- Performance: LCP < 2.5s, FID < 100ms
- Segurança: 0 vulnerabilidades críticas
- UX: Taxa de conclusão > 80%
