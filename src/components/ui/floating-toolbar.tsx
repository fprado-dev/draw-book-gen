'use client';

import { useState } from 'react';
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
  Wand2,
  MoreHorizontal,
  Undo,
  Redo,
  Save,
  Download,
  Share2,
} from 'lucide-react';
import { AIImageSheet } from '@/components/ui/ai-image-sheet';

export function FloatingToolbar() {
  const [isAISheetOpen, setIsAISheetOpen] = useState(false);
  return (
    <div className="absolute right-4 top-4 flex flex-col items-center gap-2 rounded-lg bg-white/50 p-2 backdrop-blur-sm">
      <Button
        size="icon"
        variant="ghost"
        title="Generate AI Image"
        onClick={() => setIsAISheetOpen(true)}
      >
        <Wand2 className="h-4 w-4" />
      </Button>
      <AIImageSheet open={isAISheetOpen} onOpenChange={setIsAISheetOpen} />
      <Button size="icon" variant="ghost" title="Undo">
        <Undo className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost" title="Redo">
        <Redo className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost" title="Save">
        <Save className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
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
