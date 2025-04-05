'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import {
  DailyImageStats,
  DailyOutlinesStats,
  getDailyImageStats,
  getDailyOutlineStats,
} from '@/services/dashboard.service';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  images: {
    label: 'AI Images',
    color: 'hsl(var(--chart-1))',
  },
  outlines: {
    label: 'AI Outlines',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    if (isMobile) {
      setTimeRange('7d');
    }
  }, [isMobile]);

  const { data: chartData, isLoading } = useQuery({
    queryKey: ['get-daily-ai-stats'],
    queryFn: async () => {
      const [imageStats, outlineStats] = await Promise.all([
        getDailyImageStats(),
        getDailyOutlineStats(),
      ]);

      const mergedData = mergeData({ imageStats, outlineStats });

      return mergedData;
    },
  });

  const mergeData = ({
    imageStats,
    outlineStats,
  }: {
    outlineStats: DailyOutlinesStats[];
    imageStats: DailyImageStats[];
  }) => {
    if (!imageStats || !outlineStats) return [];

    const dateMap = new Map();

    // Initialize with image data
    imageStats.forEach((item) => {
      dateMap.set(item.date, {
        date: item.date,
        images: item.images,
        outlines: 0,
      });
    });

    // Merge outline data
    outlineStats.forEach((item) => {
      if (dateMap.has(item.date)) {
        const existing = dateMap.get(item.date);
        existing.outlines = item.outlines;
      } else {
        dateMap.set(item.date, {
          date: item.date,
          images: 0,
          outlines: item.outlines,
        });
      }
    });

    return Array.from(dateMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };
  const filteredData = chartData?.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === '15d') {
      daysToSubtract = 15;
    } else if (timeRange === '7d') {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  if (isLoading) {
    return (
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardTitle className="bg-muted h-3 w-24 animate-pulse rounded" />
          <CardDescription>
            <div className="bg-muted h-4 w-40 animate-pulse rounded" />
          </CardDescription>
          <div className="absolute right-4 top-4">
            <div className="bg-muted h-8 w-40 animate-pulse rounded" />
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="bg-muted h-[250px] w-full animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="@container/card relative">
      <CardHeader className="relative">
        <CardTitle>AI Usage</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              Last 3 months
            </ToggleGroupItem>
            <ToggleGroupItem value="15d" className="h-8 px-2.5">
              Last 15 days
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              Last 7 days
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="@[767px]/card:hidden flex w-40"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="15d" className="rounded-lg">
                Last 15 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillImages" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillOutlines" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-2)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="images"
              type="bump"
              animateNewValues
              animationDuration={2000}
              fill="url(#fillImages)"
              stroke="var(--chart-1)"
              stackId="a"
            />
            <Area
              dataKey="outlines"
              type="bump"
              animationDuration={2000}
              animateNewValues
              fill="url(#fillOutlines)"
              stroke="var(--chart-2)"
              stackId="b"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {!chartData ||
        (chartData.length <= 1 && (
          <div className="left-o bg-primary-foreground/40 dark:bg-primary-foreground/70 absolute top-0 flex h-full w-full items-center justify-center rounded-xl">
            <div className="text-muted-foreground text-center">
              <p>No AI usage data available yet!</p>
              <p className="mt-2 text-sm">
                Try generating some AI images or outlines to see your usage
                statistics.
              </p>
            </div>
          </div>
        ))}
    </Card>
  );
}
