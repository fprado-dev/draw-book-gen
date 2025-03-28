'use client';

import { BookImagesProvider } from '@/contexts/BookImagesContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <BookImagesProvider>
      {children}
    </BookImagesProvider>
  );
}