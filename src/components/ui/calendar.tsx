'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('rounded-lg border bg-white p-2 shadow-sm', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-x-4 sm:space-x-2',
        month: 'flex flex-col space-y-3',
        caption: 'flex justify-center pt-2 relative items-center px-4',
        caption_label: 'text-sm font-semibold text-slate-800',
        nav: 'flex items-center space-x-1',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'size-7 bg-transparent p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors'
        ),
        nav_button_previous: 'absolute left-2',
        nav_button_next: 'absolute right-2',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex justify-between',
        head_cell:
          'text-slate-500 rounded-md w-9 font-medium text-[0.8rem] py-2',
        row: 'flex w-full mt-1 justify-between',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-slate-100 [&:has([aria-selected].day-range-end)]:rounded-r-md transition-colors',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md'
        ),
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-9 p-0 font-normal hover:bg-slate-100 focus:bg-slate-200 aria-selected:opacity-100 transition-colors'
        ),
        day_range_start:
          'day-range-start aria-selected:bg-slate-900 aria-selected:text-slate-50 hover:bg-slate-800',
        day_range_end:
          'day-range-end aria-selected:bg-slate-900 aria-selected:text-slate-50 hover:bg-slate-800',
        day_selected:
          'bg-slate-900 text-slate-50 hover:bg-slate-800 focus:bg-slate-700',
        day_today: 'bg-slate-100 text-slate-900 font-semibold',
        day_outside:
          'day-outside text-slate-400 aria-selected:text-slate-400 hover:bg-transparent',
        day_disabled: 'text-slate-300 hover:bg-transparent cursor-not-allowed',
        day_range_middle:
          'aria-selected:bg-slate-100 aria-selected:text-slate-900',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn('size-4', className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn('size-4', className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
