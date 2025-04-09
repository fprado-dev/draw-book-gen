'use client';

import { ChevronRight, Folder, LayoutDashboard } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

const navMain = [
  {
    title: 'Getting Started',
    url: '#',
    icon: Folder,
    isActive: true,
    items: [
      {
        title: 'Books',
        url: '/books',
        isDisabled: false,
      },
      {
        title: 'Outlines',
        url: '/outlines',
        isDisabled: false,

      },
      {
        title: 'AI Images',
        url: '#',
        isDisabled: true,
      },
    ],
  },
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: 'Overview',
        url: '/dashboard',
        isDisabled: false,


      },
      {
        title: 'Usage',
        url: '/dashboard/usage',
        isDisabled: false,

      },
      {
        title: 'Settings',
        url: '/dashboard/settings',
        isDisabled: false,

      },
    ],
  },
];

export function NavMain() {
  const pathName = usePathname();
  return (
    <SidebarGroup>
      <Separator className="mb-4" />
      <SidebarMenu>
        {navMain.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>

                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub >
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild isActive={pathName === subItem.url}>
                        <Link href={subItem.url} className={subItem.isDisabled ? "cursor-not-allowed" : ""}>
                          <span>{subItem.title}</span>
                          {subItem.isDisabled && <Badge variant="outline" className='ml-1 bg-primary text-white'>soon</Badge>}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
