"use client"

import * as React from "react"
import {
  BadgeCentIcon,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { createClient } from "@/utils/supabase/server"
import { User } from "@supabase/supabase-js"
import { usePathname } from "next/navigation"
import { useIsPublicRoute } from "@/hooks/use-is-public-routes"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },


  navSecondary: [
    {
      title: "Upgrade to PRO",
      url: "#",
      icon: BadgeCentIcon,
    },

  ],
}



export function AppSidebar({ user, ...props }: { user: User | null, props?: React.ComponentProps<typeof Sidebar> }) {
  const isPublicRoute = useIsPublicRoute()
  if (isPublicRoute) {
    return null
  }
  return (
    <Sidebar collapsible="offcanvas"  {...props}>
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
  )
}
