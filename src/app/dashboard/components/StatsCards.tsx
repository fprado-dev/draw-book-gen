'use client';

import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { QueryClient, useQuery } from '@tanstack/react-query';
import { getUserStats } from '@/services/dashboard.service';
import { useEffect } from 'react';

const queryClient = new QueryClient();

export function StatsCards() {
  const { data: statsInfos, isLoading } = useQuery({
    queryKey: ['get-user-stats'],
    queryFn: async () => {
      const { totalBooks, totalImages } = await getUserStats();
      return { totalBooks, totalImages };
    },
  });

  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  });

  if (isLoading) {
    return (
      <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="@container/card">
            <CardHeader className="relative">
              <div className="bg-muted h-4 w-24 animate-pulse rounded" />
              <div className="bg-muted mt-2 h-8 w-16 animate-pulse rounded" />
              <div className="absolute right-4 top-4">
                <div className="bg-muted h-6 w-16 animate-pulse rounded" />
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="bg-muted h-4 w-32 animate-pulse rounded" />
              <div className="bg-muted h-4 w-40 animate-pulse rounded" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Books</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {statsInfos?.totalBooks}
          </CardTitle>
          <div className="absolute right-4 top-0">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingDownIcon className="size-3" />
              -20%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Books created this month</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Pages</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {0}
          </CardTitle>
          <div className="absolute right-4 top-0">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Pages created in {statsInfos?.totalBooks} Books{' '}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Money saved with zero effort{' '}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Images Generated</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {statsInfos?.totalImages}
          </CardTitle>
          <div className="absolute right-4 top-0">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              High Quality
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Using Ailustra model
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Cost of $0,001 each</div>
        </CardFooter>
      </Card>
    </div>
  );
}
