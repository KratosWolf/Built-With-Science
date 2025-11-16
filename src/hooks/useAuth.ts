'use client';

import { useAuthContext } from '@/contexts/AuthContext';

/**
 * Custom hook to access authentication context
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, signIn, signOut } = useAuth();
 *
 *   if (!user) {
 *     return <button onClick={() => signIn(email, password)}>Login</button>
 *   }
 *
 *   return <button onClick={signOut}>Logout</button>
 * }
 * ```
 */
export function useAuth() {
  return useAuthContext();
}
