import { deleteBook, getAllBooks } from '@/services/book.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { mainQueryClient } from '@/components/providers';
import { BentoCard } from '@/components/ui/bento-card';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';
import { useSidebar } from '@/components/ui/sidebar';
import { TBook } from '@/types/ebook';
import { useRouter } from 'next/navigation';
import { formatBookCard } from '../utils/format-card';
import { AlertDialogConfirmation } from './alert-dialog-confirmation';
import { FormUpdateBook } from './form-edit';
import { SkeletonBook } from './skeleton-book';

export function BooksList() {
  const router = useRouter();
  const { open } = useSidebar();

  const queryClient = useQueryClient(mainQueryClient);

  const [isOpenDialogDelete, setDialogDelete] = useState(false);
  const [bookToDelete, setBookToDelete] = useState({
    bookTitle: '',
    bookId: '',
  });

  const [isOpenUpdateSheet, setUpdateSheet] = useState(false);
  const [bookToUpdate, setBookToUpdate] = useState<TBook>();

  const { data, isLoading } = useQuery({
    queryKey: ['books'],
    enabled: true,
    queryFn: async () => {
      const { books } = await getAllBooks();
      return { books };
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: deleteBook,
    mutationKey: ['delete-book'],
    onSuccess: () => {
      setDialogDelete(false);
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success(`Book ${bookToDelete.bookTitle} deleted successfully`);
    },
  });

  const onConfirmDelete = async () => {
    deleteBookMutation.mutate(bookToDelete.bookId);
  };

  const handleDeleteBook = async (bookId: string, bookTitle: string) => {
    setBookToDelete({ bookTitle, bookId });
    setDialogDelete(true);
  };

  const handleUpdateBook = async (bookId: string) => {
    setBookToUpdate(data?.books?.find((book) => book.id === bookId));
    setUpdateSheet(true);
  };

  const handleOnViewBook = (bookId: string) => {
    const current_book = data?.books?.find((book) => book.id === bookId);
    localStorage.setItem(
      'aillustra-current-book',
      JSON.stringify({ title: current_book?.title, id: current_book?.id })
    );
    router.push(`/books/${bookId}`);
  };

  return (
    <>
      <AlertDialogConfirmation
        title={bookToDelete.bookTitle}
        isOpen={isOpenDialogDelete}
        onOpenChange={setDialogDelete}
        onConfirm={onConfirmDelete}
      />
      <Sheet onOpenChange={setUpdateSheet} open={isOpenUpdateSheet}>
        <SheetContent className="px-4 py-4">
          <SheetTitle>Update Book</SheetTitle>
          <SheetDescription>
            Make changes to your book's details below. The title serves as the
            main identifier for your book, so ensure it remains clear and
            memorable.
          </SheetDescription>
          <FormUpdateBook
            book={bookToUpdate!}
            closeModal={() => setUpdateSheet(false)}
          />
        </SheetContent>
      </Sheet>
      {isLoading && <SkeletonBook />}
      <div
        className={`grid gap-4  @max-xl:grid-cols-1 @min-xl:@max-3xl:grid-cols-2 @min-3xl:@max-7xl:grid-cols-3 grid-cols-4`}
      >
        {data?.books &&
          data.books.length > 0 &&
          formatBookCard(data.books!).map((book) => (
            <BentoCard
              key={book.id}
              item={book}
              onDelete={handleDeleteBook}
              onEdit={handleUpdateBook}
              onView={handleOnViewBook}
            />
          ))}
      </div>
      {data?.books && data.books.length === 0 && (
        <EmptyState
          title="No books found"
          description="Create your first book to get started."
        />
      )}
    </>
  );
}
