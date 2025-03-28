import { deleteBook, getAllBooks } from "@/services/book.service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react";
import { toast } from "sonner";


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { BentoCard, BentoItem } from "@/components/ui/bento-card";
import { TBook } from "@/types/ebook";
import { formatDistanceToNow } from "date-fns";
import { Book } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { mainQueryClient } from "@/components/providers";


export function BooksList() {
  const queryClient = useQueryClient(mainQueryClient);

  const [isOpenDialogDelete, setDialogDelete] = useState(false);
  const [bookToDelete, setBookToDelete] = useState({ bookTitle: "", bookId: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["books"],
    enabled: true,
    queryFn: async () => {
      const { books } = await getAllBooks()
      return { books }
    }
  })

  const deleteBookMutation = useMutation({
    mutationFn: deleteBook,
    mutationKey: ["delete-book"],
    onSuccess: () => {
      setDialogDelete(false)
      queryClient.invalidateQueries({ queryKey: ["books"] })
      toast.success(`Book ${bookToDelete.bookTitle} deleted successfully`)
    }
  })
  const onConfirmDelete = async () => {
    deleteBookMutation.mutate(bookToDelete.bookId)
  }

  const handleDeleteBook = async (bookId: string, bookTitle: string) => {
    setBookToDelete({ bookTitle, bookId })
    setDialogDelete(true)
  }

  const formatBookCard = (books: TBook[]): BentoItem<TBook>[] => {
    const formattedOutlines = books.map((book): BentoItem<TBook> => {
      return {
        id: book.id,
        title: book.title,
        cta: 'Explore →',
        description: `${formatDistanceToNow(book.last_viewed)} ago`,
        status: book.status.charAt(0).toUpperCase() + book.status.slice(1),
        tags: [book.size, book.book_type, book.paper_color],
        icon: <Book className="w-4 h-4 text-purple-500" />,

      }
    })
    return formattedOutlines
  }


  return (
    <>
      <AlertDialogConfirmation title={bookToDelete.bookTitle} isOpen={isOpenDialogDelete} onOpenChange={setDialogDelete} onConfirm={onConfirmDelete} />
      {isLoading && (
        <SkeletonBook />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data?.books && data.books.length > 0 && formatBookCard(data.books!).map((book) => (
          <BentoCard key={book.id} item={book} onDelete={handleDeleteBook} />
        ))}
      </div>
      {data?.books && data.books.length === 0 && <EmptyState title="No books found" description="Create your first book to get started." />}
    </>
  )
}


type TAlertDialogConfirmationProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  title: string;
}
export function AlertDialogConfirmation({ isOpen, onOpenChange, onConfirm, title }: TAlertDialogConfirmationProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            Book <b>{title}</b> and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}


const SkeletonBook = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[...Array(3)].map((_, index) => (
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
  )
}