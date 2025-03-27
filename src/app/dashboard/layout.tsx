'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';

export const queryDashboardClient = new QueryClient();
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    return () => {
      queryDashboardClient.clear();
    }
  })

  return (
    <>
      {children}
    </>
  );
}
