'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
interface Props {
  children?: ReactNode;
  session?: any;
}

export const mainQueryClient = new QueryClient();
export default function Providers({ children }: Props) {
  return (
    <QueryClientProvider client={mainQueryClient}>
      <main>{children}</main>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
