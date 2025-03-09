'use client';



import { supabase } from '@/services/supabase';
import { User } from '@supabase/supabase-js';

import { useEffect, useState } from 'react';
import { HeaderLayout } from "@/components/header/header";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [user, setUser] = useState<User | undefined>()
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


    <div>
      <HeaderLayout user={user} />
      {children}
    </div>
  );
}
