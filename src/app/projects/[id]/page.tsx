'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { BookCheck, BookImage, FolderClosedIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { TBook, TBookSize, TBookStatus } from '@/types/ebook'
import * as BooksServices from "@/services/book.service"
import { EmptyState } from '@/components/ui/empty-state'
import { BentoCard, BentoItem } from '@/components/ui/bento-card'
import { CreateBookSheet } from './components/create-book-sheet'
import { EditBookSheet } from './components/edit-book-sheet'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'


export default function ProjectDetailsPage() {
  const params = useParams()
  const queryClient = useQueryClient()
  const router = useRouter();
  const [editingBook, setEditingBook] = useState<TBook | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editBookStatus, setEditStatus] = useState<TBookStatus>('draft');
  const [editTitle, setEditTitle] = useState('');
  const [editSize, setEditSize] = useState<string>('');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<TBook | null>(null);
  const [showNewBookSheet, setShowNewBookSheet] = useState(false)


  const { data: books = [], isLoading: isLoadingBooks } = useQuery({
    queryKey: ['books', params.id],
    queryFn: async () => {
      const books = await BooksServices.getProjectBooks({
        id: params.id as string,
      });
      return books;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  const createBookMutation = useMutation({
    mutationFn: async (data: Partial<TBook>) => {
      const newBook = await BooksServices.createBook({
        title: data.title as string,
        size: data.size as TBookSize,
        status: data.status as TBookStatus,
        project_id: params.id as string,
      })
      return newBook
    },
    onSuccess: (book) => {
      toast.success(`Book created successfully ${book.title}`)
      setShowNewBookSheet(false)
      queryClient.invalidateQueries({ queryKey: ['books'] })
    },
    onError: () => {
      toast.error('Something went wrong while creating book')
    },
  })

  const handleCreateBook = async (data: Partial<TBook>) => {
    createBookMutation.mutate(data)
  }

  const updateBookMutation = useMutation({
    mutationFn: async () => {
      return await BooksServices.updateBookById({
        id: editingBook?.id,
        title: editTitle,
        size: editSize,
        status: editBookStatus,
        project_id: params.id as string,
      })
    },
    onSuccess(book) {
      toast.success(`Book ${book.title} updated successfully`);
      setEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError() {
      toast.error('Something went wrong while updating book');
    }
  });

  const deleteBookMutation = useMutation({
    mutationFn: async () => {
      return await BooksServices.deleteBookById({
        id: bookToDelete?.id as string
      })
    },
    onSuccess() {
      toast.success(`Book ${bookToDelete?.title} deleted successfully`);
      setDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError() {
      toast.error('Something went wrong while deleting book');
    }
  });

  const handleEditStatus = (status: TBookStatus) => {
    setEditStatus(status);
  };

  const handleEdit = (book: TBook) => {
    setEditingBook(book);
    setEditTitle(book.title);
    setEditSize(book.size);
    setEditStatus(book.status);
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    updateBookMutation.mutate();
  };

  const handleDelete = (book: TBook) => {
    setBookToDelete(book);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;
    deleteBookMutation.mutate();
  };

  const handleViewBook = (book: TBook) => {
    localStorage.setItem('aillustra-current-book', JSON.stringify(book));
    router.push(`/books/${book.id}`);
  };

  const formatCardProjects = (books: TBook[]): BentoItem<TBook>[] => {
    const formattedOutlines = books?.map((book): BentoItem<TBook> => {
      return {
        id: book.id,
        title: book.title,
        status: `${book.pages.length} ${book.pages.length === 1 ? 'Page' : 'Pages'}`,
        tags: [`${book.size}`, `${book.status}`],
        cta: 'Explore →',
        icon: <FolderClosedIcon className="w-4 h-4 text-purple-500" />,
        meta: book,
      }
    })
    return formattedOutlines
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-4 lg:px-6 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-8 py-4 md:gap-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Books</h1>
            <p className="text-muted-foreground mt-2">
              Manage your books here, you can create, edit, and delete your books.
            </p>
          </div>
          <Sheet
            open={showNewBookSheet}
            onOpenChange={setShowNewBookSheet}>
            <SheetTrigger asChild>
              <Button
                variant="secondary"
                className="cursor-pointer hover:-translate-y-0.5 bg-gradient-to-r from-primary  to-primary/80 text-white"
              >
                <BookImage className="h-4 w-4" />
                Create Book
              </Button>
            </SheetTrigger>
            <CreateBookSheet
              onSubmit={handleCreateBook}
              isLoading={createBookMutation.isPending}

            />
          </Sheet>

          <Sheet open={editDialogOpen}
            onOpenChange={(open) => setEditDialogOpen(open)}>
            <EditBookSheet
              isLoading={updateBookMutation.isPending}
              book={editingBook}
              onStatusChange={handleEditStatus}
              onTitleChange={setEditTitle}
              onSizeChange={setEditSize}
              onUpdate={handleUpdate}
              title={editTitle}
              size={editSize}
              status={editBookStatus}

            />
          </Sheet>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {
            formatCardProjects(books).map((book) => {
              return (
                <BentoCard
                  onDelete={() => handleDelete(book.meta!)}
                  onView={() => handleViewBook(book.meta!)}
                  key={book.id}
                  onEdit={() => handleEdit(book.meta!)}
                  item={book}
                />
              )
            })
          }
        </div>
        {isLoadingBooks && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 w-3/4 bg-muted rounded"></div>
                  <div className="h-3 w-full bg-muted rounded"></div>
                  <div className="h-3 w-2/3 bg-muted rounded"></div>
                  <div className="flex gap-2 pt-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-6 w-16 bg-muted rounded-full"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className='flex items-center justify-center'>
          {books.length === 0 && !isLoadingBooks && <EmptyState
            description='Create your first book and start profit!'
            title='No Books yet!'
            renderIcon={() => <BookCheck className='h-8 w-8 text-primary' />}
          />}
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your book
              {bookToDelete && ` "${bookToDelete.title}"`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBookToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}