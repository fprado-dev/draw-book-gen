'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';

export function SkeletonCards() {
  return (
    <div className="container mx-auto">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="bg-muted h-6 w-32 animate-pulse rounded-md" />
            <div className="bg-muted h-4 w-48 animate-pulse rounded-md" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="bg-muted h-4 w-20 animate-pulse rounded-md" />
              </div>
              <div className="bg-muted h-2 w-full animate-pulse rounded-full" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1">
                  <div className="bg-muted mx-auto h-8 w-12 animate-pulse rounded-md" />
                  <div className="bg-muted mx-auto h-4 w-24 animate-pulse rounded-md" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="bg-muted h-6 w-32 animate-pulse rounded-md" />
            <div className="bg-muted h-4 w-48 animate-pulse rounded-md" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-muted h-4 w-4 animate-pulse rounded-md" />
                    <div className="bg-muted h-4 w-32 animate-pulse rounded-md" />
                  </div>
                  <div className="bg-muted h-4 w-16 animate-pulse rounded-md" />
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div className="bg-muted h-4 w-24 animate-pulse rounded-md" />
                  <div className="bg-muted h-4 w-16 animate-pulse rounded-md" />
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
                    <div className="bg-muted h-6 w-24 rounded-md" />
                    <div className="bg-muted h-8 w-32 rounded-md" />
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {[1, 2, 3, 4].map((j) => (
                        <li key={j} className="flex items-center">
                          <div className="bg-muted mr-2 h-4 w-4 rounded-md" />
                          <div className="bg-muted h-4 w-32 rounded-md" />
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className="p-6">
                    <div className="bg-muted h-10 w-full rounded-md" />
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
