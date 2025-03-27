"use client"


import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { User } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query"
import { getUserStats } from "@/services/dashboard.service"

type TStatsCards = {
  user: User | null
}

export function StatsCards({ user }: TStatsCards) {
  const { data: statsInfos, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { totalBooks, totalImages, totalProjects } = await getUserStats({ user });
      return { totalBooks, totalImages, totalProjects };
    },
  })


  if (isLoading) {
    return (
      <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 dark:*:data-[slot=card]:bg-card lg:px-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="@container/card">
            <CardHeader className="relative">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-8 w-16 bg-muted rounded mt-2 animate-pulse" />
              <div className="absolute right-4 top-4">
                <div className="h-6 w-16 bg-muted rounded animate-pulse" />
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-4 w-40 bg-muted rounded animate-pulse" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 dark:*:data-[slot=card]:bg-card lg:px-6">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Projects</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {statsInfos?.totalProjects}
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
            Trending up this month <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            New books created this month
          </div>
        </CardFooter>
      </Card>
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
          <div className="text-muted-foreground">
            Books created this month
          </div>
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
            Pages created in {statsInfos?.totalBooks} Books    <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Money saved with zero effort </div>
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
            Using Ailustra model<TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Cost of $0,001 each</div>
        </CardFooter>
      </Card>
    </div>
  )
}

