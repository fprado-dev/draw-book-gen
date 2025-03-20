'use client';

import { ChartAreaInteractive } from "./components/ChartArea";
import { DataTable } from "./components/DataTable";
import { SectionCards } from "./components/SectionCards";
import data from "./components/data.json"

export default function Dashboard() {


  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">

        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="mx-6">
            <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your data and credit usage</p>
          </div>
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable data={data} />
        </div>
      </div>
    </div>
  );
}
