
"use client"

import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/sidebar/app-sidebar"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import DynamicBreadCrumb from "@/components/DynamicBreadCrumb";


function App({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up' || pathname === '/forgot-password' || pathname === '/reset-password' || pathname === '/sales'
  return (
    isAuthPage ? (
      <div className="flex flex-1 flex-col" >
        {children}
      </div>
    ) : (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 ">
            <div className="flex items-center justify-between w-full gap-2 px-4">
              <div className="flex gap-2 items-center">
                <SidebarTrigger className="-ml-1" />
                <DynamicBreadCrumb />
              </div>
            </div>
          </header>
          <div className="flex flex-1 flex-col">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    )

  )
}

export default App