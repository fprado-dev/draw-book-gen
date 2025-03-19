'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TBook, TBookStatus } from '@/types/ebook';
import { toast } from 'sonner';
import { Pencil, Trash, MoreVertical } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDate } from '@/lib/date';
import * as BooksService from "@/services/book.service"
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';



type EbookListProps = {
  isLoading: boolean;
  books: TBook[];
}

type TEbookParams = {
  id: string
}

const EbookList = ({ books, isLoading }: EbookListProps) => {
  const router = useRouter();
  const params = useParams<TEbookParams>();
  const queryClient = useQueryClient();

  const [editingEbook, setEditingEbook] = useState<TBook | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editBookStatus, setEditStatus] = useState<TBookStatus>('draft')
  const [editTitle, setEditTitle] = useState('');
  const [editSize, setEditSize] = useState<string>('');

  const [selectedThumbnail, setSelectedThumbnail] = useState<string>('');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ebookToDelete, setEbookToDelete] = useState<Partial<TBook> | null>();

  const updateBookMutation = useMutation({
    mutationFn: async () => {
      return await BooksService.updateBookById({
        id: editingEbook?.id,
        title: editTitle,
        size: editSize,
        status: editBookStatus,
        project_id: params.id as string,
        thumbnail_url: selectedThumbnail || editingEbook?.thumbnail_url,
      })
    },
    onSuccess(book) {
      toast.success(`Book ${book.title} updated successfully `);
      setEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError() {
      toast.error('Something went wrong while updating book');
    }
  })

  const deleteBookMutation = useMutation({
    mutationFn: async () => {
      return await BooksService.deleteBookById({
        id: ebookToDelete?.id as string
      })
    },
    onSuccess() {
      toast.success(`Book ${ebookToDelete?.title} deleted successfully `);
      setDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError() {
      toast.error('Something went wrong while deleting book');
    }
  })

  const handleEditStatus = (status: TBookStatus) => {
    setEditStatus(status);
  };

  const handleEdit = (ebook: TBook) => {
    setEditingEbook(ebook);
    setEditTitle(ebook.title);
    setEditSize(ebook.size);
    setEditStatus(ebook.status);
    setSelectedThumbnail(ebook.thumbnail_url || '');
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    updateBookMutation.mutate();
  };


  const handleDelete = async () => {
    if (!ebookToDelete) return;
    deleteBookMutation.mutate();

  };

  const handleViewBook = (book: TBook) => {
    localStorage.setItem('illustra-current-book', JSON.stringify(book))
    router.push(`/books/${book.id}`)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="animate-pulse flex flex-col justify-between">
            <CardHeader>
              <div className="h-4 w-24 bg-slate-200 rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-4 w-20 bg-slate-200 rounded" />
            </CardContent>
            <CardFooter>
              <div className="h-4 w-20 bg-slate-200 rounded" />
              <div className="h-4 w-20 bg-slate-200 rounded" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {books.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <h3 className="mb-2 text-lg font-medium">No books yet</h3>
          <p className="mb-4 text-sm text-gray-500">
            Create your first book to start generating AI-powered illustrations
          </p>

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {books.map((book) => {
            return (
              <Card key={book.id} className='flex flex-col justify-between'>
                <div className='flex flex-col gap-2 '>
                  <CardHeader className='relative'>
                    <span className="flex items-center gap-2 text-xs text-gray-500">
                      {`Last time viewed ${formatDate(book.last_viewed)}`}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <CardTitle
                      className="cursor-pointer hover:underline text-base"
                      onClick={() => handleViewBook(book)}
                    >
                      <HoverCard>
                        <HoverCardTrigger>
                          {book.title.split(' ').slice(0, 3).join(' ')}
                        </HoverCardTrigger>
                        <HoverCardContent>
                          {book.title}
                        </HoverCardContent>
                      </HoverCard>
                    </CardTitle>
                  </CardContent>
                </div>
                <CardFooter className='flex gap-2 relative justify-between items-center ' >
                  <div className='flex flex-1 gap-2'>
                    <Badge variant="outline">
                      {book.status.toUpperCase() || 'Draft'}
                    </Badge>
                    <Badge variant="outline">
                      {book.size}
                    </Badge>
                  </div>

                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer hover:bg-slate-100">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40" align="end">
                        <div className="flex flex-col space-y-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="justify-start"
                            onClick={() => handleEdit(book)}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="justify-start text-red-600 hover:text-red-600 hover:bg-red-100"
                            onClick={() => {
                              setEbookToDelete(book);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      <Sheet open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Book</SheetTitle>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={editBookStatus} onValueChange={handleEditStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-size">Book Size</Label>
              <Select value={editSize} onValueChange={setEditSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Select book size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5x8">{`5" x 8" (12.7 x 20.32 cm)`}</SelectItem>
                  <SelectItem value="5.25x8">{`5.25" x 8" (13.34 x 20.32 cm)`}</SelectItem>
                  <SelectItem value="5.5x8.5">{`5.5" x 8.5" (13.97 x 21.59 cm)`}</SelectItem>
                  <SelectItem value="6x9">{`6" x 9" (15.24 x 22.86 cm)`}</SelectItem>
                  <SelectItem value="7x10">{`7" x 10" (17.78 x 25.4 cm)`}</SelectItem>
                  <SelectItem value="8x10">{`8" x 10" (20.32 x 25.4 cm)`}</SelectItem>
                  <SelectItem value="8.5x11">{`8.5" x 11" (21.59 x 27.94 cm)`}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleUpdate}>Update Book</Button>
          </div>
        </SheetContent>
      </Sheet>



      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your book
              {`"${ebookToDelete?.title}"`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEbookToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export { EbookList };