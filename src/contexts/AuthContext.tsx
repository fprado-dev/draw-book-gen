'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (typeof window !== 'undefined') {
        if (session?.user) {
          const userData = {
            uid: session.user.id,
            email: session.user.email,
            displayName: session.user.user_metadata?.full_name,
            photoURL: session.user.user_metadata?.avatar_url
          };
          document.cookie = `auth-user=${JSON.stringify(userData)}; path=/; max-age=86400; SameSite=Lax`;
          sessionStorage.setItem('auth-user', JSON.stringify(userData));
        } else {
          document.cookie = 'auth-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          sessionStorage.removeItem('auth-user');
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}