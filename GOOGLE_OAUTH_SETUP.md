# Google OAuth Configuration Guide

## Issue Detected
The Google login button is not working because Google OAuth hasn't been enabled in your Supabase project yet.

**Evidence from server logs:**
```
GET /auth/callback
Auth callback - Code: missing
```

This means the OAuth flow is being initiated but Supabase isn't properly configured to handle Google authentication.

---

## Step-by-Step Setup Guide

### 1. Configure Google OAuth in Supabase Dashboard

1. Go to your Supabase project: https://app.supabase.com/project/gktvfldykmzhynqthbdn
2. Navigate to **Authentication** → **Providers** in the left sidebar
3. Find **Google** in the list of providers
4. Click on **Google** to expand the configuration
5. Toggle **Enable Sign in with Google** to ON

### 2. Get Google OAuth Credentials

You already have a Google Client ID in `.env.local`:
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=1056439056041-dc8j1ifqtri0u899s0l6kqnhqg2sle24.apps.googleusercontent.com
```

But you also need the **Client Secret**. To get it:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one if needed)
3. Go to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID: `1056439056041-dc8j1ifqtri0u899s0l6kqnhqg2sle24`
5. Click on it to view details
6. Copy the **Client Secret** (it will look like: `GOCSPX-xxxxxxxxxxxxxxxxxxxxx`)

### 3. Add Google Credentials to Supabase

Back in the Supabase dashboard (step 1.5 above):

1. Paste your **Client ID** into the field:
   ```
   1056439056041-dc8j1ifqtri0u899s0l6kqnhqg2sle24.apps.googleusercontent.com
   ```

2. Paste your **Client Secret** (from step 2.6)

3. **IMPORTANT**: Copy the **Redirect URL** that Supabase shows you. It should look like:
   ```
   https://gktvfldykmzhynqthbdn.supabase.co/auth/v1/callback
   ```

4. Click **Save** in Supabase

### 4. Configure Authorized Redirect URIs in Google Cloud

1. Go back to [Google Cloud Console](https://console.cloud.google.com/) → **Credentials**
2. Click on your OAuth 2.0 Client ID again
3. In the **Authorized redirect URIs** section, add BOTH:
   ```
   https://gktvfldykmzhynqthbdn.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   ```

4. Click **Save**

**Why both URIs?**
- The Supabase URI handles the OAuth exchange
- The localhost URI is where your app receives the final redirect during development

### 5. Verify Configuration

After completing the above steps:

1. Make sure your `.env.local` has:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://gktvfldykmzhynqthbdn.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=1056439056041-dc8j1ifqtri0u899s0l6kqnhqg2sle24.apps.googleusercontent.com
   ```

2. Restart your dev server:
   ```bash
   # Kill current server (Ctrl+C)
   npm run dev
   ```

3. Go to http://localhost:3000/login

4. Open DevTools Console (F12) and click "Continuar com Google"

5. You should now see:
   - The debug logs we added
   - A redirect to Google's login page
   - After authenticating, redirect back to /dashboard

---

## Expected Flow After Configuration

When properly configured, clicking "Continuar com Google" should:

1. **Client logs** (from browser console):
   ```
   🔵 [1] handleGoogleSignIn CHAMADO
   🔵 [2] Setando isGoogleLoading = true
   🔵 [3] Verificando signInWithGoogle: function
   🔵 [4] Chamando signInWithGoogle()...
   🔐 [AUTH] signInWithGoogle CHAMADO
   🔐 [AUTH] Supabase client disponível: true
   🔐 [AUTH] Window origin: http://localhost:3000
   🔐 [AUTH] Redirect URL: http://localhost:3000/auth/callback
   🔐 [AUTH] Chamando supabase.auth.signInWithOAuth...
   🔐 [AUTH] OAuth response - data: { url: "https://accounts.google.com/..." }
   ✅ [AUTH] Google sign in initiated successfully
   ```

2. **Redirect to Google** - User sees Google login page

3. **After Google auth** - Redirect to: `https://gktvfldykmzhynqthbdn.supabase.co/auth/v1/callback?code=...`

4. **Supabase processes** - Exchanges code for session

5. **Final redirect** - Back to your app: `http://localhost:3000/auth/callback?code=...`

6. **Your callback handler** - Exchanges code and redirects to /dashboard

7. **Server logs** (from terminal):
   ```
   🔐 Auth callback - Code: present
   ✅ Session exchanged successfully: user@gmail.com
   ✅ Redirecting to dashboard
   ```

---

## Common Issues

### Issue: "Access blocked: This app's request is invalid"
**Solution:** Make sure the redirect URI in Google Cloud Console matches EXACTLY what Supabase provides

### Issue: "Redirect URI mismatch"
**Solution:** Check that you added BOTH URIs to Google Cloud Console:
- Supabase callback: `https://gktvfldykmzhynqthbdn.supabase.co/auth/v1/callback`
- Local callback: `http://localhost:3000/auth/callback`

### Issue: Still showing "Code: missing"
**Solution:** Google OAuth is not enabled in Supabase dashboard - go back to step 1

### Issue: "Invalid client"
**Solution:** Client ID or Secret is incorrect in Supabase configuration

---

## Testing Checklist

After configuration:

- [ ] Google provider is ENABLED in Supabase dashboard
- [ ] Client ID is added to Supabase
- [ ] Client Secret is added to Supabase
- [ ] Both redirect URIs are added to Google Cloud Console
- [ ] Dev server is restarted
- [ ] Browser console shows debug logs when clicking button
- [ ] Redirects to Google login page
- [ ] After Google auth, redirects back with code
- [ ] Successfully logs in and shows dashboard

---

## Next Steps

1. Complete the configuration steps above
2. Test the Google login flow
3. Share any errors you see in the browser console
4. Once working, we can remove the debug logs
