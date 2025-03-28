'use client';

import { ComponentProps } from 'react';

import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import { TeamSwitcher } from './team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { User } from '@supabase/supabase-js';
import { useIsPublicRoute } from '@/hooks/use-is-public-routes';

export function AppSidebar({
  user,
  ...props
}: {
  user: User | null;
  props?: ComponentProps<typeof Sidebar>;
}) {
  const isPublicRoute = useIsPublicRoute();
  if (isPublicRoute) {
    return null;
  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
