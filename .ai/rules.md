# Regras para Assistentes de IA

## Contexto do Projeto
Built With Science - Uma plataforma moderna para compartilhar e descobrir conhecimento científico

## Regras Obrigatórias

### 1. Segurança (OWASP Top 10)
- SEMPRE validar inputs com Zod
- NUNCA expor dados sensíveis em logs
- SEMPRE usar prepared statements
- IMPLEMENTAR rate limiting em todas APIs
- VALIDAR permissões antes de ações
- SANITIZAR outputs para prevenir XSS

### 2. Padrões de Código
- USE TypeScript strict mode
- SIGA convenções de nomenclatura do projeto
- IMPLEMENTE error boundaries
- USE async/await ao invés de callbacks
- MANTENHA componentes pequenos e focados

### 3. Performance
- IMPLEMENTE lazy loading para imagens
- USE React.memo() quando apropriado
- OTIMIZE bundle size
- IMPLEMENTE caching estratégico

### 4. Documentação
- COMENTE lógica complexa
- ATUALIZE docs ao modificar APIs
- MANTENHA README atualizado
- DOCUMENTE decisões arquiteturais

### 5. Git e Versionamento
- Commits atômicos e descritivos
- Branch naming: feature/*, bugfix/*, hotfix/*
- Sempre criar PR antes de merge
- Executar testes antes de push

## APIs e Endpoints

### Endpoints Públicos
Configurar CORS apropriadamente para endpoints que precisam ser públicos:
```typescript
// Exemplo para API pública
export async function POST(req: Request) {
  // Configurar CORS para endpoint público
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  
  // Validar input
  const validation = schema.safeParse(await req.json());
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input' },
      { status: 400, headers }
    );
  }
  
  // Processar...
}
```

## Checklist Antes de Commit

- [ ] Código passa no TypeScript sem erros
- [ ] Testes executados com sucesso
- [ ] Sem dados sensíveis expostos
- [ ] Documentação atualizada
- [ ] Segurança verificada (OWASP)
- [ ] Performance otimizada
