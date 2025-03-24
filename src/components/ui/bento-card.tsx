
"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import { Button } from './button';
import { EllipsisVerticalIcon, EyeIcon, Trash2Icon } from 'lucide-react';

export interface BentoItem<T> {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: string;
  tags?: string[];
  meta?: T;
  cta?: string;
  colSpan?: number;
  hasPersistentHover?: boolean;
}

interface BentoGridProps<T> {
  item: BentoItem<T>;
  onView?: () => void;
  onDelete?: () => void;
}


function BentoCard<T>({ item, onDelete, onView }: BentoGridProps<T>) {
  return (
    <div
      className={cn(
        "group relative p-4 rounded-xl overflow-hidden transition-all duration-300",
        "border border-gray-100 dark:border-white/10 bg-white dark:bg-black",
        "hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_2px_12px_rgba(255,255,255,0.03)]",
        "hover:-translate-y-0.5 will-change-transform bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:4px_4px]",
        item.colSpan || "col-span-1",
        item.colSpan === 2 ? "md:col-span-2" : "",
        {
          "shadow-[0_2px_12px_rgba(0,0,0,0.03)] -translate-y-0.5":
            item.hasPersistentHover,
          "dark:shadow-[0_2px_12px_rgba(255,255,255,0.03)]":
            item.hasPersistentHover,
        }
      )}
    >
      <div
        className={`absolute inset - 0 ${item.hasPersistentHover
          ? "opacity-100"
          : "opacity-0 group-hover:opacity-100"
          } transition - opacity duration - 300`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
      </div>

      <div className="relative flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          {item.icon && <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/5 dark:bg-white/10 group-hover:bg-gradient-to-br transition-all duration-300">
            {item.icon}
          </div>}
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-lg backdrop-blur-sm",
              "bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300",
              "transition-colors duration-300 group-hover:bg-black/10 dark:group-hover:bg-white/20"
            )}
          >
            {item.status && item.status || "Active"}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 tracking-tight text-[15px]">
            {item.title}
            {item.meta && <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-normal">
              {formatDate((item?.meta as unknown as { created_at: string })?.created_at)}
            </span>}
          </h3>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            {item.tags && item.tags?.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-md bg-black/5 dark:bg-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/20"
              >
                #{tag}
              </span>
            ))}
          </div>
          <DropdownMenu key={item.id} >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="cursor-pointer text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <EllipsisVerticalIcon className='w-4 h-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-20" side='bottom' >
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={onView} className='flex items-center gap-4 justify-start cursor-pointer'>
                  <EyeIcon className='w-4 h-4' />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className='flex items-center gap-4 justify-start text-destructive cursor-pointer'>
                  <Trash2Icon className='w-4 h-4' />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>

      <div
        className={`absolute inset - 0 - z - 10 rounded - xl p - px bg - gradient - to - br from - transparent via - gray - 100 / 50 to - transparent dark: via - white / 10 ${item.hasPersistentHover
          ? "opacity-100"
          : "opacity-0 group-hover:opacity-100"
          } transition - opacity duration - 300`}
      />
    </div>
  );
}

export { BentoCard }


