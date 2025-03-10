'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ebook } from '@/types/ebook';
import { getProjectEbooks, updateEbook, deleteEbook } from '@/services/ebook.service';
import { toast } from 'sonner';
import Image from 'next/image';
import { Pencil, Trash, CalendarIcon, BookTextIcon, PlusIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { supabase } from '@/services/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDate } from '@/lib/date';
import { User } from '@supabase/supabase-js';


type EbookListProps = {
  isLoading: boolean;
  ebooks: Ebook[];
}

type TEbookParams = {
  id: string
}

const EbookList = ({ ebooks, isLoading }: EbookListProps) => {
  const router = useRouter();
  const params = useParams<TEbookParams>();
  const [user, setUser] = useState<User>();
  const queryClient = useQueryClient();

  const [editingEbook, setEditingEbook] = useState<Ebook | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ebookToDelete, setEbookToDelete] = useState<Ebook | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSize, setEditSize] = useState<string>('');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        router.push('/sign-in');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);



  const updateEbookMutation = useMutation({
    mutationFn: async ({ userId, projectId, ebookId, data }: { userId: string; projectId: string; ebookId: string; data: any }) => {
      const { success, error } = await updateEbook(userId, projectId, ebookId, data);
      if (error) throw new Error(error);
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ebooks'] });
      toast.success('Book updated successfully');
      setEditDialogOpen(false);
      setEditingEbook(null);
    },
    onError: (error) => {
      console.error('Error updating book:', error);
      toast.error('Failed to update book');
    },
  });

  const deleteEbookMutation = useMutation({
    mutationFn: async ({ userId, projectId, ebookId }: { userId: string; projectId: string; ebookId: string }) => {
      const { success, error } = await deleteEbook(userId, projectId, ebookId);
      if (error) throw new Error(error);
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ebooks'] });
      toast.success('Book deleted successfully');
      setDeleteDialogOpen(false);
      setEbookToDelete(null);
    },
    onError: (error) => {
      console.error('Error deleting book:', error);
      toast.error('Failed to delete book');
    },
  });

  const handleEdit = (ebook: Ebook) => {
    setEditingEbook(ebook);
    setEditTitle(ebook.title);
    setEditSize(ebook.size);
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingEbook || !editTitle.trim() || !editSize || !user) return;

    updateEbookMutation.mutate({
      userId: user.id,
      projectId: params.id,
      ebookId: editingEbook.id,
      data: {
        title: editTitle,
        size: editSize,
      },
    });
  };

  const handleDelete = async () => {
    if (!ebookToDelete || !user) return;

    deleteEbookMutation.mutate({
      userId: user.id,
      projectId: params.id,
      ebookId: ebookToDelete.id,
    });
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
      {ebooks.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <h3 className="mb-2 text-lg font-medium">No books yet</h3>
          <p className="mb-4 text-sm text-gray-500">
            Create your first book to start generating AI-powered illustrations
          </p>

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ebooks.map((ebook) => {
            return (
              <Card key={ebook.id}>
                <CardHeader>
                  <div className="flex flex-col gap-4">
                    <div className="w-full h-40 bg-slate-100 rounded-md overflow-hidden flex items-center justify-center">
                      {ebook.thumbnailUrl ? (
                        <Image
                          src={ebook.thumbnailUrl}
                          alt={ebook.title}
                          width={100}
                          height={100}
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
                    <div className="space-y-1">
                      <CardTitle
                        className="flex items-center gap-2 cursor-pointer hover:underline"
                        onClick={() => router.push(`/books/${ebook.id}`)}
                      >
                        {ebook.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <CalendarIcon className="h-3 w-3" />
                        {formatDate(ebook.created_at)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${ebook.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                          {ebook.status || 'Draft'}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${ebook.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                          {ebook.size}
                        </span>
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
                        onClick={() => handleEdit(ebook)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-600 hover:bg-red-100"
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

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
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
        </DialogContent>
      </Dialog>

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