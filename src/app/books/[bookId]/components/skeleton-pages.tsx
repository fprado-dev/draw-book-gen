'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonPages() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {[...Array(3)].map((_, index) => (
        <Skeleton key={index} className="border-foreground h-64 w-52" />
      ))}
    </div>
  );
}
