import React, { createContext, useCallback, useEffect, useState } from 'react';
import { isSupabaseConfigured } from '@app/config';
import { getSupabaseClient } from './client';
import { mockLogin, mockSignup } from './mock';
import { AuthContextValue, User } from './types';

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isMockMode = !isSupabaseConfigured();

  useEffect(() => {
    if (isMockMode) {
      setLoading(false);
      return;
    }

    const client = getSupabaseClient();
    if (!client) {
      setLoading(false);
      return;
    }

    client.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email ?? '',
        });
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? '' });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [isMockMode]);

  const login = useCallback(
    async (email: string, password: string) => {
      if (isMockMode) {
        const result = mockLogin(email, password);
        if (result.user) setUser(result.user);
        return { error: result.error };
      }

      const client = getSupabaseClient();
      if (!client) return { error: 'Supabase is not configured.' };

      const { error } = await client.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    },
    [isMockMode]
  );

  const signup = useCallback(
    async (email: string, password: string) => {
      if (isMockMode) {
        const result = mockSignup();
        return { error: result.error };
      }

      const client = getSupabaseClient();
      if (!client) return { error: 'Supabase is not configured.' };

      const { error } = await client.auth.signUp({ email, password });
      return { error: error?.message ?? null };
    },
    [isMockMode]
  );

  const logout = useCallback(async () => {
    if (isMockMode) {
      setUser(null);
      return;
    }

    const client = getSupabaseClient();
    if (client) await client.auth.signOut();
  }, [isMockMode]);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isMockMode }}>
      {children}
    </AuthContext.Provider>
  );
}
