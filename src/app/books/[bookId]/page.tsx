'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FloatingToolbar } from '@/components/ui/floating-toolbar';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function BookPages() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-6">
      <div className="col-span-1 border-r bg-slate-50">
        <ScrollArea className="h-screen p-4 data-[state]:visible">
          <div className="mb-4 mt-4 flex flex-col gap-8 px-4">
            {Array.from({ length: 15 }).map((_, i) => (
              <Card
                key={i}
                className="group relative cursor-pointer overflow-hidden border-slate-200 bg-white transition-shadow hover:shadow-md"
              >
                <div className="pointer-events-none absolute right-0 top-0 h-0 w-0 border-l-[40px] border-t-[40px] border-l-transparent border-t-slate-100 transition-colors group-hover:border-t-slate-200" />
                <CardContent className="relative">
                  <div className="relative h-52 rounded-sm border border-slate-100 bg-white">
                    <div className="grid-rows-16 pointer-events-none absolute inset-0 grid grid-cols-12 opacity-5">
                      {Array.from({ length: 192 }).map((_, i) => (
                        <div
                          key={i}
                          className="border-slate-50"
                          style={{
                            borderRight: i % 12 !== 11 ? '1px solid' : 'none',
                            borderBottom:
                              Math.floor(i / 12) !== 15 ? '1px solid' : 'none',
                          }}
                        />
                      ))}
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-sm text-slate-400">Page 1</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div id="section-page-editor" className="relative col-span-5">
        <FloatingToolbar />
        <Button
          size="sm"
          variant="ghost"
          className="absolute left-5 top-5 flex items-center justify-center gap-2 text-sm text-slate-400"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex h-full w-full items-center justify-center">
          <Card
            className="group relative  h-5/6 w-full max-w-[calc(100vh*0.666)] cursor-pointer overflow-hidden border-slate-200 bg-white transition-shadow hover:shadow-md"
            style={{ aspectRatio: '2/3' }}
          >
            <div className="pointer-events-none absolute right-0 top-0 h-0 w-0 border-l-[40px] border-t-[40px] border-l-transparent border-t-slate-100 transition-colors group-hover:border-t-slate-200" />
            <CardContent className="relative h-full">
              <div className="relative h-full rounded-sm border border-slate-100 bg-white">
                <div className="grid-rows-16 pointer-events-none absolute inset-0 grid grid-cols-12 opacity-5">
                  {Array.from({ length: 192 }).map((_, i) => (
                    <div
                      key={i}
                      className="border-slate-50"
                      style={{
                        borderRight: i % 12 !== 11 ? '1px solid' : 'none',
                        borderBottom:
                          Math.floor(i / 12) !== 15 ? '1px solid' : 'none',
                      }}
                    />
                  ))}
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-slate-400">Page 1</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
