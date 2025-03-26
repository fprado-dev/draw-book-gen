'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { TBook, TBookStatus } from '@/types/ebook';

interface CreateBookSheetProps {
  isLoading: boolean;
  onSubmit: (data: Partial<TBook>) => void;
}

export function CreateBookSheet({ isLoading, onSubmit }: CreateBookSheetProps) {
  const [title, setTitle] = useState('');
  const [size, setSize] = useState<string>('');
  const [status, setStatus] = useState<string>('draft');




  const handleCreateBook = () => {
    onSubmit({ title, size, status: status as TBookStatus });
  };


  return (
    <SheetContent className='p-4'>
      <SheetHeader>
        <SheetTitle>Create New Book</SheetTitle>
      </SheetHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter book title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="size">Book Size</Label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger id="size">
              <SelectValue placeholder="Select book size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5x8">5x8</SelectItem>
              <SelectItem value="5.25x8">5.25x8</SelectItem>
              <SelectItem value="5.5x8.5">5.5x8.5</SelectItem>
              <SelectItem value="6x9">6x9</SelectItem>
              <SelectItem value="7x10">7x10</SelectItem>
              <SelectItem value="8x10">8x10</SelectItem>
              <SelectItem value="8.5x11">8.5x11</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select book status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline">Cancel</Button>
        </SheetClose>
        <Button
          onClick={handleCreateBook}
          disabled={isLoading}
          variant="secondary" className="cursor-pointer hover:-translate-y-0.5 bg-gradient-to-r from-primary  to-primary/80 text-white"
        >
          {isLoading ? 'Creating...' : 'Create Book'}
        </Button>
      </SheetFooter>
    </SheetContent>
  );
}