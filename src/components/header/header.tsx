'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabase';
import { User } from '@supabase/supabase-js';

import { Bell, BotMessageSquare } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type THeaderLayout = {
  user: User | undefined,
}

export const HeaderLayout = ({ user }: THeaderLayout) => {
  const router = useRouter()
  const handleNavigateToProfile = () => {
    router.push('/profile')
  }

  return (<header className="border-b w-full">
    <div className="container mx-auto flex h-16 items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <div className="flex items-center space-x-2">
            <BotMessageSquare />
            <span className="font-semibold">Illustraai</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className='cursor-pointer' >
          Projects
        </Button>

        <button className="relative cursor-pointer">
          <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            3
          </span>
        </button>

        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-2 rounded-sm">
              <span className="text-sm text-gray-600">{user?.email || 'Loading...'}</span>
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
                <AvatarFallback className="rounded-lg">
                  {user?.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="end">
            <div className="flex flex-col space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className='cursor-pointer'
                onClick={handleNavigateToProfile}
              >
                Profile
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className='cursor-pointer'
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = '/sign-in';
                }}
              >
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  </header>
  )
}