# Documentação Técnica - Built With Science

## Arquitetura

### Frontend
- **Framework**: Next.js 15 com App Router
- **Estilização**: Tailwind CSS + Shadcn/ui
- **Estado**: Context API / Zustand (quando necessário)
- **Validação**: Zod + React Hook Form

### Backend
- **API Routes**: Next.js Route Handlers
- **Validação**: Middleware com Zod
- **Autenticação**: Sistema de autenticação integrado
- **Rate Limiting**: Implementado em todas as APIs
- **Dados**: Mock data (sem banco de dados inicialmente)

### Segurança
- CSP Headers configurados
- CORS com whitelist
- Input sanitization
- SQL injection prevention
- XSS protection

## Padrões de Código

### Estrutura de Pastas
```
src/
├── app/              # Rotas e páginas
├── components/       # Componentes reutilizáveis
│   ├── ui/          # Shadcn components
│   └── features/    # Componentes de features
├── lib/             # Utilidades e configurações
│   ├── security/    # Funções de segurança
│   ├── mock-data/   # Dados mockados
│   └── validations/ # Schemas Zod
├── hooks/           # Custom hooks
└── types/           # TypeScript types
```

### Convenções
- Componentes: PascalCase
- Funções utilitárias: camelCase
- Constantes: UPPER_SNAKE_CASE
- Arquivos: kebab-case

## APIs e Endpoints

### Padrões de API
- Versionamento: /api/v1/
- Autenticação: Bearer token
- Rate limiting: 100 req/min
- CORS: Configurado por endpoint

### Endpoints Públicos
- GET /api/v1/articles - Buscar artigos públicos
- GET /api/v1/research - Explorar pesquisas
- POST /api/v1/contact - Formulário de contato

## Mock Data Strategy
Inicialmente, o projeto utilizará dados mockados para desenvolvimento rápido:
- Dados armazenados em `/src/lib/mock-data/`
- Simular delays de rede para realismo
- Estrutura preparada para migração futura para banco de dados

## Segurança

### Headers HTTP
```typescript
// middleware.ts
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
}
```

### Validações
Toda entrada de dados deve ser validada com Zod antes do processamento.

