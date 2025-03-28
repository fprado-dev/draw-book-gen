'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { cn } from '@/lib/utils';
import { Button } from './button';
import {
  EllipsisVerticalIcon,
  EyeIcon,
  Trash2Icon,
  EditIcon,
} from 'lucide-react';

export interface BentoItem<T> {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: string;
  tags?: string[];
  meta?: T;
  cta?: string;
  color?: string;
  colSpan?: number;
  hasPersistentHover?: boolean;
}

interface BentoGridProps<T> {
  item: BentoItem<T>;
  onView: (id: string) => void;
  onDelete: (id: string, title: string) => void;
  onEdit?: (id: string) => void;
}

function BentoCard<T>({ item, onDelete, onView, onEdit }: BentoGridProps<T>) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl p-4 transition-all duration-300',
        'border border-gray-100 bg-white dark:border-white/10 dark:bg-black',
        'hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_2px_12px_rgba(255,255,255,0.03)]',
        'bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:4px_4px] will-change-transform hover:-translate-y-0.5',
        item.colSpan || 'col-span-1',
        item.colSpan === 2 ? 'md:col-span-2' : '',
        {
          '-translate-y-0.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]':
            item.hasPersistentHover,
          'dark:shadow-[0_2px_12px_rgba(255,255,255,0.03)]':
            item.hasPersistentHover,
        }
      )}
    >
      <div
        className={`inset - 0 absolute ${item.hasPersistentHover
          ? 'opacity-100'
          : 'opacity-0 group-hover:opacity-100'
          } - opacity duration - 300 transition`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:4px_4px] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
      </div>

      <div className="relative flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {item.icon && (
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg bg-black/5 transition-all duration-300 group-hover:bg-gradient-to-br dark:bg-white/10`}
              >
                {' '}
                {item.icon}
              </div>
            )}
            <span className="text-xs">{item.description}</span>
          </div>
          <span
            className={cn(
              'rounded-lg px-2 py-1 text-xs font-medium backdrop-blur-sm',
              'bg-black/5 text-gray-600 dark:bg-white/10 dark:text-gray-300',
              'transition-colors duration-300 group-hover:bg-black/10 dark:group-hover:bg-white/20'
            )}
          >
            {(item.status && item.status) || 'Active'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <h3
            onClick={() => onView(item.id)}
            className="cursor-pointer font-medium tracking-tight text-gray-900 transition-all hover:-translate-y-0.5 dark:text-gray-100"
          >
            {item.title}
          </h3>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            {item.tags &&
              item.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="rounded-md bg-black/5 px-2 py-1 backdrop-blur-sm transition-all duration-200 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20"
                >
                  {tag}
                </span>
              ))}
          </div>
          <DropdownMenu key={item.id}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="cursor-pointer text-xs text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-gray-400"
              >
                <EllipsisVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-20" side="bottom">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => onView(item.id)}
                  className="flex cursor-pointer items-center justify-start gap-4"
                >
                  <EyeIcon className="h-4 w-4" />
                  View
                </DropdownMenuItem>
                {onEdit && (
                  <DropdownMenuItem
                    onClick={() => onEdit(item.id)}
                    className="flex cursor-pointer items-center justify-start gap-4"
                  >
                    <EditIcon className="h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => onDelete(item.id, item.title)}
                  className="text-destructive flex cursor-pointer items-center justify-start gap-4"
                >
                  <Trash2Icon className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div
        className={`inset - 0 - z - 10 - xl p - px bg - gradient - to - br from - transparent via - gray - 100 / 50 to - transparent dark: via - white / 10 absolute rounded ${item.hasPersistentHover
          ? 'opacity-100'
          : 'opacity-0 group-hover:opacity-100'
          } - opacity duration - 300 transition`}
      />
    </div>
  );
}

export { BentoCard };
