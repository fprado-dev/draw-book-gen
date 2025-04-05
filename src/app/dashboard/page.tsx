'use client';
import { PageHeader } from '@/components/page-header';
import { PageWrapper } from '@/components/page-wrapper';
import { ChartAreaInteractive } from './components/ChartArea';
import { StatsCards } from './components/StatsCards';

export default function Dashboard() {
  return (
    <PageWrapper>
      <PageHeader
        titleText="Track your book creation metrics"
        description="View detailed analytics and generation history through interactive visualizations."
      />
      <StatsCards />
      <ChartAreaInteractive />
    </PageWrapper>
  );
}
