'use client';

import {
  useIsEditorRoute,
  useIsPublicRoute,
} from '@/hooks/use-is-public-routes';
import DynamicBreadCrumb from './DynamicBreadCrumb';
import { ThemeToggle } from './theme-toggle';
import { SidebarTrigger } from './ui/sidebar';

export const HeaderLayout = () => {
  const isEditorRoute = useIsEditorRoute();
  const isPublicRoute = useIsPublicRoute();
  if (isPublicRoute) {
    return null;
  }

  if (isEditorRoute) {
    return null;
  }
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 ">
      <div className="flex w-full items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <DynamicBreadCrumb />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
