# CSP Verification Guide - Passo a Passo

## CSP Corrigido e Servidor Reiniciado ✅

O Content Security Policy foi expandido e o servidor foi reiniciado com cache limpo.

---

## O QUE FOI CONFIGURADO

### CSP Expandido no next.config.js:

```javascript
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://gktvfldykmzhynqthbdn.supabase.co https://*.supabase.co https://accounts.google.com https://*.google.com;
  frame-src 'self' https://accounts.google.com https://*.google.com
```

### Mudanças Importantes:
1. ✅ **`https://*.supabase.co`** adicionado - Permite todos os subdomínios Supabase
2. ✅ **`https://accounts.google.com`** adicionado ao `script-src`
3. ✅ **`https://*.google.com`** adicionado ao `frame-src`
4. ✅ **`experimental.serverActions`** configurado para evitar conflitos

---

## COMO VERIFICAR SE CSP ESTÁ APLICADO

### Método 1: Verificar Headers no Network Tab (RECOMENDADO)

1. **Abra o navegador** em http://localhost:3000/login

2. **Abra DevTools**:
   - Pressione `F12` OU
   - Clique direito → "Inspecionar"

3. **Vá para a aba Network**:
   - No topo do DevTools, clique em "Network"
   - Se estiver vazia, recarregue a página (`Ctrl/Cmd + R`)

4. **Clique na primeira requisição** (geralmente "login"):
   - Será a primeira linha da lista
   - Tipo: "document"

5. **Vá para a aba "Headers"**:
   - No painel direito, clique em "Headers"
   - Role para baixo até "Response Headers"

6. **Procure por "content-security-policy"**:
   - Deve aparecer na lista
   - Valor deve conter: `connect-src 'self' https://gktvfldykmzhynqthbdn.supabase.co https://*.supabase.co`

### Exemplo do que você deve ver:

```
Response Headers:
  content-security-policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://gktvfldykmzhynqthbdn.supabase.co https://*.supabase.co https://accounts.google.com https://*.google.com; frame-src 'self' https://accounts.google.com https://*.google.com
  x-frame-options: DENY
  x-content-type-options: nosniff
  referrer-policy: strict-origin-when-cross-origin
```

---

### Método 2: Verificar no Console (ALTERNATIVO)

1. **Abra o Console**:
   - DevTools (F12) → Console

2. **Digite este comando**:
   ```javascript
   fetch(window.location.href).then(r => r.headers.get('content-security-policy'))
   ```

3. **Pressione Enter**

4. **Deve retornar** o valor do CSP (não `null`)

---

## TESTE DO GOOGLE LOGIN

Agora você pode testar se o Google login funciona:

### Passos:

1. **Vá para** http://localhost:3000/login

2. **Abra o Console** (F12 → Console)

3. **Clique em "Continuar com Google"**

4. **Observe os logs**:
   ```javascript
   🔵 [1] handleGoogleSignIn CHAMADO
   🔵 [2] Setando isGoogleLoading = true
   🔵 [3] Verificando signInWithGoogle: function
   🔵 [4] Chamando signInWithGoogle()...
   🔐 [AUTH] signInWithGoogle CHAMADO
   🔐 [AUTH] Supabase client disponível: true
   🔐 [AUTH] Window origin: http://localhost:3000
   🔐 [AUTH] Redirect URL: http://localhost:3000/auth/callback
   🔐 [AUTH] Chamando supabase.auth.signInWithOAuth...
   ```

5. **Não deve haver erros** do tipo:
   - ❌ "Refused to connect because it violates CSP"
   - ❌ "Refused to frame because it violates CSP"

---

## SE AINDA HOUVER ERRO DE CSP

### Sintoma: Erro "Refused to connect" no Console

Se você ainda ver erro de CSP bloqueando Supabase:

1. **Capture o erro exato**:
   - Copie a mensagem completa do console
   - Anote qual URL está sendo bloqueada

2. **Verifique se o CSP foi aplicado**:
   - Use Método 1 acima para confirmar que o header está presente

3. **Possíveis causas**:
   - **Cache do navegador**: Limpe cache do navegador (`Ctrl/Cmd + Shift + Delete`)
   - **Headers não aplicados**: Servidor não reiniciou corretamente
   - **URL específica não coberta**: O erro dirá qual URL foi bloqueada

---

## CHECKLIST DE VERIFICAÇÃO

Por favor, complete e me retorne:

- [ ] ✅ Servidor está rodando em http://localhost:3000
- [ ] ✅ Abri http://localhost:3000/login no navegador
- [ ] ✅ Abri DevTools (F12) → Network tab
- [ ] ✅ Recarreguei a página
- [ ] ✅ Cliquei na requisição "login"
- [ ] ✅ Vi "Response Headers"
- [ ] ✅ Encontrei "content-security-policy"
- [ ] ✅ Valor contém "https://*.supabase.co"
- [ ] ✅ Cliquei em "Continuar com Google"
- [ ] ✅ Vi os logs debug no Console
- [ ] ✅ NÃO vi erro "Refused to connect"

---

## PRÓXIMOS PASSOS

### Se CSP está aplicado e NÃO há erros:
✅ **CSP configurado corretamente!**
- O Google login deve funcionar (após configurar OAuth no Supabase)
- Consulte `GOOGLE_OAUTH_SETUP.md` para configurar no Supabase

### Se CSP NÃO está aplicado:
❌ **Headers não estão sendo enviados**
- Verificar se next.config.js foi salvo corretamente
- Tentar reiniciar servidor novamente
- Verificar se há erros no terminal do servidor

### Se AINDA há erro "Refused to connect":
⚠️ **URL específica está bloqueada**
- Me envie o erro completo do console
- Identificarei qual URL precisa ser adicionada ao CSP

---

## INFORMAÇÕES DO SERVIDOR

**Status**: ✅ Rodando
**Local**: http://localhost:3000
**Network**: http://172.20.10.5:3000
**Experiments**: serverActions habilitado
**Ready**: 1.5 segundos

Pronto para teste!
