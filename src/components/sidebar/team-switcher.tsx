'use client';

import * as React from 'react';
import Logo from '../../app/Logo';
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center justify-center pt-4">
        <Logo className="w-32" />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
