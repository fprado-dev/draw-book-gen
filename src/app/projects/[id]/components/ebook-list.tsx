'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TBook, TBookStatus } from '@/types/ebook';
import { toast } from 'sonner';
import Image from 'next/image';
import { Pencil, Trash, CalendarIcon, BookTextIcon, PlusIcon, ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDate } from '@/lib/date';
import { User } from '@supabase/supabase-js';
import * as BooksService from "@/services/book.service"

type UnsplashImage = {
  url: string;
  thumb: string;
  description: string | null;
  author: string;
};

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

  const [thumbnailSheetOpen, setThumbnailSheetOpen] = useState(false);
  const [unsplashImages, setUnsplashImages] = useState<UnsplashImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleOpenThumbnailSheet = async () => {
    if (!editingEbook) return;

    setThumbnailSheetOpen(true);
    await fetchUnsplashImages(editTitle || 'book cover');
  };

  const fetchUnsplashImages = async (query: string) => {
    setIsLoadingImages(true);
    try {
      const images = await BooksService.getBookThumbnailOptions(query);
      setUnsplashImages(images);
    } catch (error) {
      toast.error('Failed to fetch images from Unsplash');
      console.error(error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleSearchImages = async () => {
    if (!searchQuery.trim()) return;
    await fetchUnsplashImages(searchQuery);
  };

  const handleSelectThumbnail = (url: string) => {
    setSelectedThumbnail(url);
    setThumbnailSheetOpen(false);
  };

  const handleDelete = async () => {
    if (!ebookToDelete) return;
    deleteBookMutation.mutate();

  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="h-6 w-24 bg-slate-200 rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-4 w-20 bg-slate-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Books</h2>
      {books.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <h3 className="mb-2 text-lg font-medium">No books yet</h3>
          <p className="mb-4 text-sm text-gray-500">
            Create your first book to start generating AI-powered illustrations
          </p>

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {books.map((ebook) => {
            return (
              <Card key={ebook.id}>
                <CardHeader>
                  <div className="flex flex-col gap-4">
                    <div className="w-full h-40 bg-slate-100 rounded-md overflow-hidden flex items-center justify-center">
                      {ebook.thumbnail_url ? (
                        <Image
                          src={ebook.thumbnail_url}
                          alt={ebook.title}
                          width={400}
                          height={400}
                          className="object-cover"
                        />
                      ) : (
                        <BookTextIcon
                          width={100}
                          height={100}
                          className="object-cover text-gray-300"
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-4">
                      <CardTitle
                        className="flex items-center gap-2 cursor-pointer hover:underline"
                        onClick={() => router.push(`/books/${ebook.id}`)}
                      >
                        {ebook.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${ebook.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                          {ebook.status.toUpperCase() || 'Draft'}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${ebook.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                          {ebook.size}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <CalendarIcon className="h-3 w-3" />
                        {`Last time viewed ${formatDate(ebook.last_viewed)}`}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className='cursor-pointer hover:bg-slate-100'
                        onClick={() => handleEdit(ebook)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer text-red-600 hover:text-red-600 hover:bg-red-100"
                        onClick={() => {
                          setEbookToDelete(ebook);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
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
              <Label>Thumbnail</Label>
              <div className="flex flex-col items-center gap-2">
                {selectedThumbnail ? (
                  <div className="relative rounded-md w-full overflow-hidden">
                    <Image
                      width={500}
                      height={50}
                      src={selectedThumbnail}
                      alt="Selected thumbnail"
                      className="object-cover w-full h-24"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-slate-100 rounded-md flex items-center justify-center">
                    <BookTextIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <Button
                  variant="outline"
                  onClick={handleOpenThumbnailSheet}
                  type="button"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Choose Cover
                </Button>
              </div>
            </div>
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
                  <SelectItem value="5x8">5" x 8" (12.7 x 20.32 cm)</SelectItem>
                  <SelectItem value="5.25x8">5.25" x 8" (13.34 x 20.32 cm)</SelectItem>
                  <SelectItem value="5.5x8.5">5.5" x 8.5" (13.97 x 21.59 cm)</SelectItem>
                  <SelectItem value="6x9">6" x 9" (15.24 x 22.86 cm)</SelectItem>
                  <SelectItem value="7x10">7" x 10" (17.78 x 25.4 cm)</SelectItem>
                  <SelectItem value="8x10">8" x 10" (20.32 x 25.4 cm)</SelectItem>
                  <SelectItem value="8.5x11">8.5" x 11" (21.59 x 27.94 cm)</SelectItem>
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
              "{ebookToDelete?.title}".
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