'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BookImagesProvider } from '@/contexts/BookImagesContext';

const queryClient = new QueryClient();
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <BookImagesProvider>
          {children}
        </BookImagesProvider>
      </div>
    </QueryClientProvider>
  );
}
