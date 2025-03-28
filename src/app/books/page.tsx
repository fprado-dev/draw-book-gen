'use client';

import { useState } from 'react';
import { BookPlus } from 'lucide-react';

import { PageHeader } from '@/components/page-header';
import { PageWrapper } from '@/components/page-wrapper';

import { FormCreateBook } from './components/form-create';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';
import { BooksList } from './components/books-list';

export default function Page() {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <PageWrapper>
      <PageHeader
        titleText="Browse and manage your book collection."
        description="Create new books, update existing ones, or remove titles and quickly find books with our search feature."
        icon={<BookPlus className="h-4 w-4" />}
        button_text="Create New Book"
        onClick={() => setIsCreating(true)}
      />
      <Sheet onOpenChange={setIsCreating} open={isCreating}>
        <SheetContent className="px-4 py-4">
          <SheetTitle>Create New Book</SheetTitle>
          <SheetDescription>
            Start by entering the title of your new book. This will be the main
            identifier for your book, so make sure to be descriptive and easy to
            remember.
          </SheetDescription>
          <FormCreateBook closeModal={() => setIsCreating(false)} />
        </SheetContent>
      </Sheet>
      <BooksList />
    </PageWrapper>
  );
}
