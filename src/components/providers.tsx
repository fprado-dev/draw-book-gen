'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface Props {
  children?: ReactNode;
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
