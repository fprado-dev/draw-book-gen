'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { FileSlidersIcon, Plus, Trash2 } from 'lucide-react';
import { TPage } from '@/types/ebook';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import EditPageSheet from './edit-page-sheet';
import Image from 'next/image';



type PageGridProps = {
  bookId: string;
  pages: TPage[];
  onPageCreate: (page: Omit<TPage, 'id' | 'order'>) => void;
  onPageDelete: (pageId: string) => void;
  isLoading?: boolean;
};

export default function PageGrid({ pages, onPageCreate, onPageDelete }: PageGridProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);
  const [editingPage, setEditingPage] = useState<TPage | null>(null);
  const [showEditSheet, setShowEditSheet] = useState(false);

  const handleCreatePage = () => {
    onPageCreate({
      title: `Page ${pages.length + 1}`,
      type: "blank",
    });

  };


  const handleDeletePage = (pageId: string) => {
    setPageToDelete(pageId);
    setShowDeleteConfirm(true);
  }

  const handleEditPage = (page: TPage) => {
    setEditingPage(page);
    setShowEditSheet(true);
  }

  const confirmDelete = () => {
    if (pageToDelete) {
      onPageDelete(pageToDelete);
      setShowDeleteConfirm(false);
      setPageToDelete(null);
    }
  }

  return (
    <div className="mt-8">
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this page?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This page will be permanently deleted from the book.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete Page
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">{pages.length} Pages</h3>
        <div className='flex gap-2 items-center'>
          <Button size="sm" className="gap-2 cursor-pointer" onClick={handleCreatePage}>
            <Plus className="h-4 w-4" />
            <span className='text-xs'>Add Page</span>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
        {
          pages.map((page, index) => (
            <ContextMenu key={page.id}>
              <ContextMenuTrigger>
                <Card className="cursor-pointer hover:shadow-md transition-shadow relative group overflow-hidden bg-white border-slate-200">
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-l-[40px] border-t-slate-100 border-l-transparent pointer-events-none group-hover:border-t-slate-200 transition-colors" />
                  <CardContent className="relative">
                    <div className="aspect-[3/4] rounded-sm bg-white border border-slate-100 relative">
                      <div className="absolute inset-0 grid grid-cols-12 grid-rows-16 pointer-events-none opacity-5">
                        {Array.from({ length: 192 }).map((_, i) => (
                          <div key={i} className="border-slate-50" style={{ borderRight: i % 12 !== 11 ? '1px solid' : 'none', borderBottom: Math.floor(i / 12) !== 15 ? '1px solid' : 'none' }} />
                        ))}
                      </div>
                      {page.type === 'illustration' && page.imageUrl ? (
                        <Image src={page.imageUrl} alt={page.title} className="absolute inset-0 w-full h-full object-cover" />
                      ) : page.type === 'text' ? (
                        <p className="absolute inset-0 p-4 text-sm text-red-600 line-clamp-3">{page.content || 'No content yet'}</p>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-sm text-slate-400">Page {index + 1}</p>
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
          ))
        }
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