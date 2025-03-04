'use client';



import { app } from '@/services/firebase';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

import { useEffect, useState } from 'react';
import { HeaderLayout } from "@/components/header/header";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    const auth = getAuth(app)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
      }
    })
    return () => unsubscribe()
  }, [])


  return (


    <div>
      <HeaderLayout user={user} />
      {children}
    </div>
  );
}
