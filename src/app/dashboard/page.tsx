'use client';

import { useQuery } from "@tanstack/react-query";
import { ChartAreaInteractive } from "./components/ChartArea";
import { DataTable } from "./components/DataTable";
import { StatsCards } from "./components/StatsCards";
import data from "./components/data.json"
import { getUserStats } from "@/services/dashboard.service";


export default function Dashboard() {
  const { data: statsInfos, isLoading: isLoadingStatsInfos } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { totalBooks, totalImages, totalProjects } = await getUserStats();
      return { totalBooks, totalImages, totalProjects };
    },
  })

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">

        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="mx-6">
            <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your data and credit usage</p>
          </div>
          <StatsCards userStats={statsInfos} isLoading={isLoadingStatsInfos} />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable data={data} />
        </div>
      </div>
    </div>
  );
}
