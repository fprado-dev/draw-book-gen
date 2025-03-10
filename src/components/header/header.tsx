'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabase';
import { User } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { Bell, BotMessageSquare, Loader2, LogOutIcon, UserCircle2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';

type THeaderLayout = {
  user: User | undefined,
}

type UserProfile = {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export const HeaderLayout = ({ user }: THeaderLayout) => {
  const router = useRouter();

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data: profile, error } = await supabase
        .from('users')
        .select('id, name, avatar, email')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return profile as UserProfile;
    },
    enabled: !!user?.id
  });

  const handleNavigateToProfile = () => {
    router.push('/profile');
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/sign-in');
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-2 rounded-sm">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-600">Loading...</span>
                </div>
              ) : (
                <>
                  <Avatar className="h-10 w-10 rounded-full">
                    <AvatarImage className='object-cover' src={userProfile?.avatar || ''} />
                    <AvatarFallback className="rounded-lg">
                      {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="top"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-2 font-normal">
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-base text-muted-foreground">{userProfile?.name}</span>
                <span className="truncate text-sm text-muted-foreground">{userProfile?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleNavigateToProfile} className='text-muted-foreground cursor-pointer' >
                <UserCircle2Icon className='w-5 mr-2 text-muted-foreground' />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className='text-muted-foreground cursor-pointer' onClick={handleLogout}>
                <LogOutIcon className='w-5 mr-2 text-muted-foreground' />
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
  )
}