# 🚀 Guia de Deploy - Built With Science Dashboard

## Pré-requisitos

- ✅ Código funcionando localmente
- ✅ GitHub repository criado
- ✅ Conta Vercel (gratuita) - https://vercel.com

## Passo a Passo

### 1. Push para GitHub

```bash
# Inicializar git (se ainda não fez)
git init

# Adicionar remote (substitua SEU-USUARIO pelo seu usuário GitHub)
git remote add origin https://github.com/SEU-USUARIO/built-with-science-web.git

# Verificar status
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "feat: dashboard completo com autenticação, metas e animações"

# Push
git push -u origin main
```

### 2. Conectar Vercel ao GitHub

1. Acesse: https://vercel.com
2. Faça login com sua conta GitHub
3. Clique em **"Add New Project"**
4. Selecione **"Import Git Repository"**
5. Encontre e selecione seu repositório: `built-with-science-web`
6. Vercel detectará Next.js automaticamente ✅

### 3. Configurar Variáveis de Ambiente

**IMPORTANTE**: Antes de fazer deploy, configure as variáveis de ambiente na Vercel.

Na página de configuração do projeto, vá em:
**Settings → Environment Variables**

Adicione as seguintes variáveis:

#### Para Production, Preview e Development:

```
NEXT_PUBLIC_SUPABASE_URL
https://gktvfldykmzhynqthbdn.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrdHZmbGR5a216aHlucXRoYmRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMzgzNTQsImV4cCI6MjA0NjkxNDM1NH0.8DYrfBfE6GFWOTPKPAq2wdCMYyWpJoN9G-i3FwCxDAY

NEXT_PUBLIC_GOOGLE_CLIENT_ID
1056439056041-dc8j1ifqtri0u899s0l6kqnhqg2sle24.apps.googleusercontent.com
```

**Como adicionar**:
1. Cole o nome da variável (ex: `NEXT_PUBLIC_SUPABASE_URL`)
2. Cole o valor correspondente
3. Selecione todos os ambientes: Production, Preview, Development
4. Clique em "Save"
5. Repita para as 3 variáveis

### 4. Deploy!

1. Após configurar as variáveis de ambiente, clique em **"Deploy"**
2. Aguarde ~2-3 minutos enquanto Vercel:
   - Instala dependências
   - Executa build
   - Otimiza assets
   - Publica na Edge Network

3. ✅ Deploy concluído! Você verá:
   - URL do projeto: `https://seu-projeto.vercel.app`
   - Status: Ready
   - Build logs disponíveis

### 5. Configurar URLs de Callback no Google Console

**IMPORTANTE**: O Google OAuth só funcionará após configurar as URLs de produção.

1. Acesse: https://console.cloud.google.com
2. Selecione seu projeto
3. Vá em **Credentials → OAuth 2.0 Client IDs**
4. Clique no seu Client ID

**Adicione às Authorized JavaScript origins**:
```
https://seu-projeto.vercel.app
```

**Adicione às Authorized redirect URIs**:
```
https://seu-projeto.vercel.app/auth/callback
```

5. Clique em **Save**

### 6. Atualizar URLs no Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto: `gktvfldykmzhynqthbdn`
3. Vá em **Authentication → URL Configuration**

**Site URL**:
```
https://seu-projeto.vercel.app
```

**Redirect URLs** (adicione):
```
https://seu-projeto.vercel.app/auth/callback
```

4. Clique em **Save**

### 7. Configurar Domínio Customizado (Opcional)

Vercel fornece gratuitamente: `seu-projeto.vercel.app`

Para usar seu próprio domínio:

1. No projeto Vercel, vá em **Settings → Domains**
2. Clique em **Add Domain**
3. Digite seu domínio (ex: `app.builtwithscience.com`)
4. Configure DNS conforme instruções da Vercel:
   - Adicione um registro CNAME apontando para `cname.vercel-dns.com`
   - OU adicione registros A/AAAA fornecidos
5. Aguarde propagação DNS (~10 minutos)
6. ✅ HTTPS automático configurado pela Vercel

**Após configurar domínio customizado**: Atualize URLs no Google Console e Supabase!

## CI/CD Automático

Após setup inicial, todo push para GitHub dispara deploy automático:

- **Push para `main`** → Deploy automático em produção ✅
- **Pull Request** → Deploy preview automático ✅
- **Rollback** → Com 1 clique na Vercel Dashboard ✅

Cada commit gera uma URL preview única para testar antes de mergear!

## Verificação Pós-Deploy

Após deploy, verifique:

1. ✅ Abrir URL: `https://seu-projeto.vercel.app`
2. ✅ Página inicial carrega corretamente
3. ✅ Testar login com Email/Senha
4. ✅ Testar Google Login (após configurar URLs)
5. ✅ Acessar `/dashboard` e verificar:
   - Stats carregando
   - Animações funcionando
   - Metas exibindo
   - Calendário de atividades
6. ✅ Testar navegação entre páginas
7. ✅ Verificar responsividade (mobile/tablet/desktop)

## Performance e Otimizações

Vercel otimiza automaticamente:

- ✅ **Edge Network**: CDN global com 100+ locations
- ✅ **Image Optimization**: Next.js Image component otimizado
- ✅ **Automatic HTTPS**: SSL/TLS certificates automáticos
- ✅ **Compression**: Gzip/Brotli automático
- ✅ **Caching**: Inteligente com invalidação automática
- ✅ **ISR**: Incremental Static Regeneration
- ✅ **Edge Functions**: Middleware executado na edge

## Monitoramento e Analytics

### Vercel Analytics (Gratuito)

Disponível automaticamente:
- Page views
- Unique visitors
- Top pages
- Geographic distribution
- Performance metrics (Core Web Vitals)

**Para ativar**:
1. Projeto Vercel → Analytics tab
2. Clique em "Enable"
3. Adicione script ao layout (opcional, auto-detectado)

### Logs em Tempo Real

Ver logs de execução:
1. Projeto Vercel → Logs tab
2. Filtrar por função, status, período
3. Ver stack traces de erros

## Troubleshooting

### Build Error

**Problema**: Build falha na Vercel

**Soluções**:
1. Verificar logs detalhados no Vercel Dashboard
2. Testar build localmente:
   ```bash
   npm run build
   ```
3. Verificar TypeScript errors:
   ```bash
   npm run type-check
   ```
4. Verificar lint:
   ```bash
   npm run lint
   ```

### Variáveis de Ambiente Não Funcionando

**Problema**: App não conecta ao Supabase

**Soluções**:
1. Verificar que variáveis começam com `NEXT_PUBLIC_`
2. Verificar que foram adicionadas no Vercel Dashboard
3. Re-deploy após adicionar variáveis:
   ```bash
   git commit --allow-empty -m "chore: trigger redeploy"
   git push
   ```

### 404 em Rotas

**Problema**: Páginas retornam 404

**Soluções**:
1. Verificar que arquivo de rota existe em `src/app/`
2. Verificar middleware.ts não está bloqueando
3. Limpar cache do Next.js e re-deploy:
   ```bash
   rm -rf .next
   git add .
   git commit -m "fix: clear cache"
   git push
   ```

### Google OAuth Não Funciona

**Problema**: Google login não funciona em produção

**Soluções**:
1. ✅ Verificar URLs no Google Console incluem URL de produção
2. ✅ Verificar URLs no Supabase incluem URL de produção
3. ✅ Aguardar ~5 minutos após salvar configurações
4. ✅ Testar em janela anônima (limpar cookies)

### Performance Issues

**Problema**: App carrega devagar

**Soluções**:
1. Verificar Core Web Vitals no Vercel Analytics
2. Otimizar imagens (usar Next.js Image component)
3. Implementar lazy loading para componentes pesados
4. Verificar bundle size:
   ```bash
   npm run build
   # Analisar output do build
   ```

## Custos

### Vercel - Plano Hobby (Gratuito)

Inclui:
- ✅ 100 GB bandwidth/mês
- ✅ Deployments ilimitados
- ✅ Domínios customizados ilimitados
- ✅ Preview deployments automáticos
- ✅ Analytics básico
- ✅ Edge Functions (100 GB-Hrs)
- ✅ SSL/HTTPS automático

**Para este projeto: GRÁTIS 100%** ✅

### Supabase - Plano Free

Inclui:
- ✅ 500 MB database
- ✅ 1 GB file storage
- ✅ 2 GB bandwidth
- ✅ 50,000 usuários autenticados
- ✅ Row Level Security
- ✅ Realtime subscriptions

**Para este projeto: GRÁTIS 100%** ✅

## URLs Importantes

### Desenvolvimento
- Local: http://localhost:3000

### Produção
- Vercel: https://seu-projeto.vercel.app
- Domínio customizado: https://seu-dominio.com (se configurado)

### Dashboards
- Vercel: https://vercel.com/dashboard
- Supabase: https://supabase.com/dashboard
- Google Console: https://console.cloud.google.com

### Repositórios
- GitHub: https://github.com/seu-usuario/built-with-science-web

## Checklist Pós-Deploy

Use este checklist após cada deploy:

- [ ] ✅ URL de produção acessível
- [ ] ✅ Login Email/Senha funcionando
- [ ] ✅ Google OAuth funcionando
- [ ] ✅ Dashboard carregando dados
- [ ] ✅ Animações rodando suavemente
- [ ] ✅ Metas exibindo corretamente
- [ ] ✅ Calendário mostrando workouts
- [ ] ✅ Navegação entre páginas OK
- [ ] ✅ Responsivo mobile/tablet/desktop
- [ ] ✅ Core Web Vitals bons (Vercel Analytics)
- [ ] ✅ Sem erros no console do browser
- [ ] ✅ Sem erros nos logs da Vercel

## Próximos Passos

Após deploy bem-sucedido:

1. **Adicionar Usuários**: Compartilhe URL com beta testers
2. **Monitorar Performance**: Acompanhe Analytics e Core Web Vitals
3. **Coletar Feedback**: Use ferramentas como Hotjar ou Google Analytics
4. **Iterar**: Faça melhorias baseadas em feedback real
5. **Documentar**: Crie changelog das features implementadas

## Suporte e Documentação

### Documentação Oficial

- Vercel: https://vercel.com/docs
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- React: https://react.dev

### Comunidades

- Vercel Discord: https://vercel.com/discord
- Next.js Discussions: https://github.com/vercel/next.js/discussions
- Supabase Discord: https://discord.supabase.com

---

## 🎉 Parabéns! Seu app está em produção!

**Dashboard funcional com**:
- ✅ Autenticação (Email + Google OAuth)
- ✅ Dashboard com stats em tempo real
- ✅ Sistema de metas com progresso
- ✅ Calendário de atividades
- ✅ Animações smooth com Framer Motion
- ✅ Comparação entre períodos
- ✅ UI responsiva e moderna

**Pronto para usar!** 🚀
