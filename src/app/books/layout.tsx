'use client';

import { BookImagesProvider } from '@/contexts/BookImagesContext';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <BookImagesProvider>{children}</BookImagesProvider>;
}
