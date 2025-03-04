'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { BotMessageSquare } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BotMessageSquare />
            <span className="font-semibold">Illustraai</span>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.push('/sign-in')}
            className="hover:bg-primary/10"
          >
            Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-slate-300 px-4 py-12 md:py-24 lg:py-32 xl:py-48 mt-14">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Unlock Your Creativity with Our AI Coloring Book Generator
              </h1>
              <p className="mx-auto  text-gray-500 md:text-xl dark:text-gray-400">
                Transform Your Ideas into Beautiful Coloring Pages in Seconds,
                Create Stunning Coloring Pages Instantly
              </p>
            </div>
            <div className="space-x-4">
              <Button
                onClick={() => router.push('/sign-in')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center rounded-lg px-8"
                size="lg"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                className="inline-flex h-11 items-center rounded-lg px-8"
                size="lg"
              >
                View Gallery
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Endless Possibilities Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            Endless Possibilities Await
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Mandalas",
                description: "Intricate designs for relaxation and focus.",
              },
              {
                title: "Animals",
                description: "Adorable creatures for all ages.",
              },
              {
                title: "Fantasy",
                description: "Magical worlds and mythical beings.",
              },
              {
                title: "Educational",
                description: "Fun learning with coloring pages.",
              },
            ].map((category, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-2 rounded-lg border p-6 text-center bg-card hover:bg-accent transition-colors"
              >
                <h3 className="text-xl font-bold">{category.title}</h3>
                <p className="text-muted-foreground">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            Why Choose Our AI Generator?
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "AI-Powered",
                description: "Intelligent design generation for unique pages.",
                icon: (
                  <svg
                    className="h-10 w-10 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                ),
              },
              {
                title: "Print-Ready",
                description: "High-quality outputs for beautiful results.",
                icon: (
                  <svg
                    className="h-10 w-10 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                ),
              },
              {
                title: "Customizable",
                description: "Tailor designs to your exact preferences.",
                icon: (
                  <svg
                    className="h-10 w-10 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                ),
              },
              {
                title: "Instant Access",
                description: "Download your creations instantly.",
                icon: (
                  <svg
                    className="h-10 w-10 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-4 text-center"
              >
                <div className="rounded-lg bg-primary/5 p-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="rounded-lg bg-primary/5 p-4">
                <svg
                  className="h-10 w-10 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Detailed Style Control</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Specify line weight, art style, and design elements for the perfect look
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="rounded-lg bg-primary/5 p-4">
                <svg
                  className="h-10 w-10 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Multiple Art Styles</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose from Kawaii, Lowpoly, and more artistic approaches
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="rounded-lg bg-primary/5 p-4">
                <svg
                  className="h-10 w-10 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Print-Ready Output</h3>
              <p className="text-gray-500 dark:text-gray-400">
                All pages optimized at 300 DPI for professional-quality printing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            Perfect For
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Teachers",
                description: "Create custom educational coloring activities",
              },
              {
                title: "Parents",
                description: "Personalize coloring experiences for your children",
              },
              {
                title: "Businesses",
                description: "Develop branded coloring books for marketing",
              },
              {
                title: "Artists",
                description: "Generate base templates to enhance with your personal touch",
              },
              {
                title: "Publishers",
                description: "Produce entire coloring books with consistent style",
              },
              {
                title: "Therapists",
                description: "Design mindfulness and relaxation coloring pages",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-2 rounded-lg border p-4 text-center"
              >
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            See What Our Users Are Creating
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-pointer transition-all hover:scale-105">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/window.svg"
                    alt={`Gallery Image ${index}`}
                    width={80}
                    height={80}
                    className="opacity-20 group-hover:opacity-30 transition-opacity"
                  />
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-center px-4">
                    {[
                      "Magical Forest Scene",
                      "Underwater Adventure",
                      "Space Explorer Series",
                      "Animal Kingdom Collection"
                    ][index - 1]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Create Your First Coloring Page?
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Sign up today and transform your ideas into beautiful, printable coloring art instantly.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <Button
                onClick={() => router.push('/sign-in')}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                Get Started Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
