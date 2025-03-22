import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import App from "./app";

// Optimize font loading with display: 'swap' to prevent layout shifts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "AIlustra - No Skills, No Problem",
  description: "No Skills, No Problem",
  appleWebApp: {
    title: "AIlustra",
    statusBarStyle: "black-translucent",

  }
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <App>
            {children}
          </App>
        </AuthProvider>
        <Toaster position="top-center" toastOptions={{
          closeButton: true,

        }} />
        <Analytics />
      </body>
    </html>
  );
}
