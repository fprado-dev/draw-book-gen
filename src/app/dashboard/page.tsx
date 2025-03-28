import { PageHeader } from '@/components/page-header';
import { ChartAreaInteractive } from './components/ChartArea';
import { StatsCards } from './components/StatsCards';
import { createClient } from '@/utils/supabase/server';
import { PageWrapper } from '@/components/page-wrapper';

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <PageWrapper>
      <PageHeader
        titleText="Track your book creation metrics"
        description="View detailed analytics and generation history through interactive visualizations."
      />
      <StatsCards />
      <ChartAreaInteractive user={user!} />
    </PageWrapper>
  );
}
