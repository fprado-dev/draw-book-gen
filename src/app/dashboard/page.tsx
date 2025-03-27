
import { ChartAreaInteractive } from "./components/ChartArea";
import { DataTable } from "./components/DataTable";
import { StatsCards } from "./components/StatsCards";
import data from "./components/data.json"
import { createClient } from "@/utils/supabase/server";


export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();


  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">

        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="mx-6">
            <h1 className="text-3xl font-bold text-primary">Dashboard {user?.email}</h1>
            <p className="text-muted-foreground mt-2">Manage your data and credit usage</p>
          </div>
          <StatsCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive user={user!} />
          </div>
          <DataTable data={data} />
        </div>
      </div>
    </div>
  );
}
