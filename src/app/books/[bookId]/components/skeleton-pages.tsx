'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonPages() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      {[...Array(3)].map((_, index) => (
        <Skeleton key={index} className='w-52 h-64 border-foreground' />

      ))}
    </div>
  );
}