import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { createClient } from '@/utils/supabase/server';
import { HeaderLayout } from '@/components/header';
import Providers from '@/components/providers';

// Optimize font loading with display: 'swap' to prevent layout shifts
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: 'AIllustra - No Skills, No Problem',
  description: 'No Skills, No Problem',
  appleWebApp: {
    title: 'AIllustra',
    statusBarStyle: 'black-translucent',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
          <AppSidebar user={user} />
          <SidebarInset>
            <HeaderLayout />
            <div className="flex flex-1 flex-col">
              <Providers>{children}</Providers>
            </div>
          </SidebarInset>
        </SidebarProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            closeButton: true,
          }}
        />
      </body>
    </html>
  );
}
