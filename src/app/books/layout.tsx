'use client';

import { supabase } from '@/services/supabase';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { HeaderLayout } from "@/components/header/header";
import { BookImagesProvider } from '@/contexts/BookImagesContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<User | undefined>(undefined)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user)
      } else {
        setUser(undefined)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <HeaderLayout user={user} />
        <BookImagesProvider>
          {children}
        </BookImagesProvider>
      </div>
    </QueryClientProvider>
  );
}