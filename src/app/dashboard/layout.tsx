'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bell, BotMessageSquare, Plus } from 'lucide-react';
import Link from 'next/link';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b fixed left-0 top-0 w-full">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <div className="flex items-center space-x-2">
                <BotMessageSquare />
                <span className="font-semibold">Illustraai</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="default" size="sm" className='cursor-pointer' onClick={() => window.location.href = '/projects'}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Project
            </Button>

            <button className="relative cursor-pointer">
              <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                3
              </span>
            </button>

            <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-2 rounded-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage />
                <AvatarFallback className="rounded-lg">JD</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">John Doe</span>
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-screen flex items-center justify-center">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
