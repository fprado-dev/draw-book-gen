"use client"

import * as React from "react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType,
    plan: string,
    credits: number,
  }[]
}) {
  const [activeTeam] = React.useState(teams[0])

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <activeTeam.logo className="size-4" />
          </div>
          <div className="flex flex-col">

            <span className="truncate font-semibold">
              {activeTeam.name}
            </span>
            <div className="flex items-center justify-center">
              <span className="truncate text-xs">
                You have <u>{activeTeam.credits} credits</u>  left!</span>
            </div>
          </div>
        </SidebarMenuButton>

      </SidebarMenuItem>
    </SidebarMenu>
  )
}
