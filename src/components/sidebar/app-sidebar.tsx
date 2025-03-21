"use client"

import * as React from "react"
import {
  BadgeCentIcon,
  BotMessageSquareIcon,
  FolderIcon,
  LayoutDashboardIcon,
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
import { User } from "@supabase/supabase-js"
import { supabase } from "@/services/supabase"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Illustra.ai",
      logo: BotMessageSquareIcon,
      plan: "Free",
      credits: 100,
    },
  ],
  navMain: [

    {
      title: "Getting Started",
      url: "#",
      icon: FolderIcon,
      isActive: true,
      items: [
        {
          title: "Projects",
          url: "/projects",
        },
        {
          title: "Outlines",
          url: "/outlines",
        },
        {
          title: "AI Images",
          url: "/ai-images",
        },
      ],
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Billing",
          url: "/dashboard/billing",
        },
        {
          title: "Settings",
          url: "/dashboard/settings",
        }
      ],
    },
  ],
  navSecondary: [
    {
      title: "Upgrade to PRO",
      url: "#",
      icon: BadgeCentIcon,
    },

  ],
}

const queryClient = new QueryClient();


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<User | undefined>(undefined)
  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user)
      } else {
        setUser(undefined)
      }
    })
    return () => subscription.unsubscribe()
  }, [])


  return (
    <QueryClientProvider client={queryClient}>
      <Sidebar collapsible="offcanvas"  {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </QueryClientProvider>
  )
}
