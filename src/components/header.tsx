'use client';



import { SidebarTrigger } from './ui/sidebar';
import DynamicBreadCrumb from './DynamicBreadCrumb';
import { useIsPublicRoute } from '@/hooks/use-is-public-routes';



export const HeaderLayout = () => {
  const isPublicRoute = useIsPublicRoute()
  if (isPublicRoute) {
    return null
  }
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 ">
      <div className="flex items-center justify-between w-full gap-2 px-4">
        <div className="flex gap-2 items-center">
          <SidebarTrigger className="-ml-1" />
          <DynamicBreadCrumb />
        </div>
      </div>
    </header>
  )
}