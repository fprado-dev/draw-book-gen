'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Download,
  MoreHorizontal,
  Redo,
  Save,
  Share2,
  Undo,
  Wand2
} from 'lucide-react';

export function FloatingToolbar({ setIsAISheetOpen }: { setIsAISheetOpen: (open: boolean) => void; }) {
  return (
    <div className="absolute right-4 top-4 flex flex-col items-center gap-2 rounded-lg p-2 border">
      <Button
        size="icon"
        variant="ghost"
        title="Generate AI Image"
        onClick={() => setIsAISheetOpen(true)}
        className='hover:text-muted-foreground'
      >
        <Wand2 className="h-4 w-4 " />
      </Button>
      <Button size="icon" variant="ghost" title="Undo" className='hover:text-muted-foreground'>
        <Undo className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost" title="Redo" className='hover:text-muted-foreground'>
        <Redo className="h-4 w-4 " />
      </Button>
      <Button size="icon" variant="ghost" title="Save" className='hover:text-muted-foreground'>
        <Save className="h-4 w-4 " />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className='hover:text-muted-foreground'>
            <MoreHorizontal className="h-4 w-4 " />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              <span>Export</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="mr-2 h-4 w-4" />
              <span>Share</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
