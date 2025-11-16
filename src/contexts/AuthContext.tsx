'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function checkSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('❌ Error checking session:', error);
        setUser(null);
      } else {
        console.log('✅ Session checked:', session?.user?.email || 'No user');
        setUser(session?.user ?? null);
      }
    } catch (error) {
      console.error('❌ Error in checkSession:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      console.log('🔐 [SIGN IN] Attempting sign in for:', email);
      console.log('🔐 [SIGN IN] Password length:', password.length);
      console.log('🔐 [SIGN IN] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('🔐 [SIGN IN] Supabase ANON_KEY (first 20):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('🔐 [SIGN IN] Response received');
      console.log('🔐 [SIGN IN] Data:', JSON.stringify(data, null, 2));
      console.log('🔐 [SIGN IN] Error:', JSON.stringify(error, null, 2));

      if (error) {
        console.error('❌ [SIGN IN] Sign in error:');
        console.error('   - Status:', error.status);
        console.error('   - Code:', error.code);
        console.error('   - Name:', error.name);
        console.error('   - Message:', error.message);
        console.error('   - Full error object:', error);
        throw error;
      }

      console.log('✅ [SIGN IN] Sign in successful!');
      console.log('✅ [SIGN IN] User email:', data.user?.email);
      console.log('✅ [SIGN IN] User ID:', data.user?.id);
      console.log('✅ [SIGN IN] Session:', data.session ? 'Present' : 'Missing');
      setUser(data.user);
    } catch (error: any) {
      console.error('❌ [SIGN IN] Exception caught:', error);
      console.error('❌ [SIGN IN] Error type:', typeof error);
      console.error('❌ [SIGN IN] Error properties:', Object.keys(error));
      throw error;
    }
  }

  async function signUp(email: string, password: string, name: string) {
    try {
      console.log('📝 Attempting sign up for:', email);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name, // User metadata
            display_name: name,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        console.error('❌ Sign up error:', error);
        throw error;
      }

      console.log('✅ Sign up successful:', data.user?.email);
      console.log('📧 Confirmation email sent to:', email);

      // Note: User will need to confirm email before they can sign in
      // Supabase automatically sends confirmation email
    } catch (error) {
      console.error('❌ Sign up failed:', error);
      throw error;
    }
  }

  async function signOut() {
    try {
      console.log('🚪 Attempting sign out');

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('❌ Sign out error:', error);
        throw error;
      }

      console.log('✅ Sign out successful');
      setUser(null);
    } catch (error) {
      console.error('❌ Sign out failed:', error);
      throw error;
    }
  }

  async function resetPassword(email: string) {
    try {
      console.log('🔑 Attempting password reset for:', email);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('❌ Password reset error:', error);
        throw error;
      }

      console.log('✅ Password reset email sent to:', email);
    } catch (error) {
      console.error('❌ Password reset failed:', error);
      throw error;
    }
  }

  async function signInWithGoogle() {
    try {
      console.log('🔐 [AUTH] signInWithGoogle CHAMADO');
      console.log('🔐 [AUTH] Supabase client disponível:', !!supabase);
      console.log('🔐 [AUTH] Window origin:', window.location.origin);

      const redirectUrl = `${window.location.origin}/auth/callback`;
      console.log('🔐 [AUTH] Redirect URL:', redirectUrl);

      console.log('🔐 [AUTH] Chamando supabase.auth.signInWithOAuth...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      console.log('🔐 [AUTH] OAuth response - data:', data);
      console.log('🔐 [AUTH] OAuth response - error:', error);

      if (error) {
        console.error('❌ [AUTH] Google sign in error:', error);
        console.error('❌ [AUTH] Error code:', error.code);
        console.error('❌ [AUTH] Error message:', error.message);
        throw error;
      }

      console.log('✅ [AUTH] Google sign in initiated successfully');
      console.log('✅ [AUTH] URL do redirect:', data?.url);
      return data;
    } catch (error) {
      console.error('❌ [AUTH] Exception in signInWithGoogle:', error);
      throw error;
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
}
