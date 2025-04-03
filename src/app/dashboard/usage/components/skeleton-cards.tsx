'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';

export function SkeletonCards() {
  return (
    <div className="container mx-auto">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="h-6 w-32 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-48 animate-pulse rounded-md bg-muted" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="h-4 w-20 animate-pulse rounded-md bg-muted" />
              </div>
              <div className="h-2 w-full animate-pulse rounded-full bg-muted" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1">
                  <div className="mx-auto h-8 w-12 animate-pulse rounded-md bg-muted" />
                  <div className="mx-auto h-4 w-24 animate-pulse rounded-md bg-muted" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="h-6 w-32 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-48 animate-pulse rounded-md bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-pulse rounded-md bg-muted" />
                    <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
                  </div>
                  <div className="h-4 w-16 animate-pulse rounded-md bg-muted" />
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
                  <div className="h-4 w-16 animate-pulse rounded-md bg-muted" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="monthly" className="w-full">
        <TabsContent value="monthly" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <Card>
                  <CardHeader>
                    <div className="h-6 w-24 rounded-md bg-muted" />
                    <div className="h-8 w-32 rounded-md bg-muted" />
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {[1, 2, 3, 4].map((j) => (
                        <li key={j} className="flex items-center">
                          <div className="mr-2 h-4 w-4 rounded-md bg-muted" />
                          <div className="h-4 w-32 rounded-md bg-muted" />
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className="p-6">
                    <div className="h-10 w-full rounded-md bg-muted" />
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}