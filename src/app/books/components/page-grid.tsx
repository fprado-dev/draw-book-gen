'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { FileSlidersIcon, Plus, Trash2 } from 'lucide-react';
import { TPage } from '@/types/ebook';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import EditPageSheet from './edit-page-sheet';
import Image from 'next/image';

type PageGridProps = {
  bookId: string;
  pages: TPage[];
  onPageCreate: (page: Omit<TPage, 'id' | 'order'>) => void;
  onPageDelete: (pageId: string) => void;
  isLoading?: boolean;
};

export default function PageGrid({
  pages,
  onPageCreate,
  onPageDelete,
}: PageGridProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);
  const [editingPage, setEditingPage] = useState<TPage | null>(null);
  const [showEditSheet, setShowEditSheet] = useState(false);

  const handleCreatePage = () => {
    onPageCreate({
      title: `Page ${pages.length + 1}`,
      type: 'blank',
    });
  };

  const handleDeletePage = (pageId: string) => {
    setPageToDelete(pageId);
    setShowDeleteConfirm(true);
  };

  const handleEditPage = (page: TPage) => {
    setEditingPage(page);
    setShowEditSheet(true);
  };

  const confirmDelete = () => {
    if (pageToDelete) {
      onPageDelete(pageToDelete);
      setShowDeleteConfirm(false);
      setPageToDelete(null);
    }
  };

  return (
    <div className="mt-8">
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this page?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This page will be permanently
              deleted from the book.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Page
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{pages.length} Pages</h3>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="cursor-pointer gap-2"
            onClick={handleCreatePage}
          >
            <Plus className="h-4 w-4" />
            <span className="text-xs">Add Page</span>
          </Button>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-4">
        {pages.map((page, index) => (
          <ContextMenu key={page.id}>
            <ContextMenuTrigger>
              <Card className="group relative cursor-pointer overflow-hidden border-slate-200 bg-white transition-shadow hover:shadow-md">
                <div className="pointer-events-none absolute right-0 top-0 h-0 w-0 border-l-[40px] border-t-[40px] border-l-transparent border-t-slate-100 transition-colors group-hover:border-t-slate-200" />
                <CardContent className="relative">
                  <div className="relative aspect-[3/4] rounded-sm border border-slate-100 bg-white">
                    <div className="grid-rows-16 pointer-events-none absolute inset-0 grid grid-cols-12 opacity-5">
                      {Array.from({ length: 192 }).map((_, i) => (
                        <div
                          key={i}
                          className="border-slate-50"
                          style={{
                            borderRight: i % 12 !== 11 ? '1px solid' : 'none',
                            borderBottom:
                              Math.floor(i / 12) !== 15 ? '1px solid' : 'none',
                          }}
                        />
                      ))}
                    </div>
                    {page.type === 'illustration' && page.imageUrl ? (
                      <Image
                        src={page.imageUrl}
                        alt={page.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : page.type === 'text' ? (
                      <p className="absolute inset-0 line-clamp-3 p-4 text-sm text-red-600">
                        {page.content || 'No content yet'}
                      </p>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-sm text-slate-400">
                          Page {index + 1}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onClick={() => handleEditPage(page)}
                className="text-slate-600"
              >
                <FileSlidersIcon className="mr-2 h-4 w-4" />
                Edit Page
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => handleDeletePage(page.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Page
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>
      {editingPage && (
        <EditPageSheet
          page={editingPage}
          isOpen={showEditSheet}
          onOpenChange={setShowEditSheet}
        />
      )}
    </div>
  );
}
