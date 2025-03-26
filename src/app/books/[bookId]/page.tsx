'use client';

import { useParams } from 'next/navigation';
import { Card, } from '@/components/ui/card';
import PageGrid from '@/app/books/components/page-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import * as BooksServices from "@/services/book.service"
import { TPage } from '@/types/ebook';


type EboookParams = {
  bookId: string;
};
export default function EbookPage() {
  const params = useParams<EboookParams>();


  const queryClient = useQueryClient();

  const { data: book } = useQuery({
    queryKey: ['books', params.bookId],
    queryFn: async () => {
      return await BooksServices.getBookById({
        id: params.bookId as string,
      })
    },
  });

  const createPageMutation = useMutation({
    mutationFn: async (page: Omit<TPage, 'id' | 'order'>) => {
      const updatedPages = [...(book?.pages || []), { ...page, id: crypto.randomUUID(), order: book?.pages?.length || 0 }];
      await BooksServices.updateBookById({
        id: params.bookId,
        pages: updatedPages
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['books', params.bookId],
      });
      toast.success('Page created successfully');
    },
    onError: () => {
      toast.error('Failed to create page');
    },
  })

  const updatePageMutation = useMutation({
    mutationFn: async (pageId: string) => {
      const updatedPages = book?.pages.filter(page => page.id !== pageId);
      await BooksServices.updateBookById({
        id: params.bookId,
        pages: updatedPages
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['books', params.bookId],
      });
      toast.success('Page deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete page');
    },
  })

  const handlePageCreate = async (page: Omit<TPage, 'id' | 'order'>) => {
    createPageMutation.mutate(page);
  }

  const handlePageDelete = async (pageId: string) => {
    updatePageMutation.mutate(pageId);

  }

  return (
    <div className="px-6">

      <div className='w-full h-fit grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card className='p-4'>
          <div className='space-y-2'>
            <h2 className='text-2xl font-bold tracking-tight'>{book?.title}</h2>
            <p className='text-sm text-muted-foreground'>Created on {new Date(book?.created_at || '').toLocaleDateString()}</p>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1'>
              <p className='text-sm font-medium'>Status</p>
              <p className='text-sm text-muted-foreground capitalize'>{book?.status || 'Draft'}</p>
            </div>
            <div className='space-y-1'>
              <p className='text-sm font-medium'>Size</p>
              <p className='text-sm text-muted-foreground capitalize'>{book?.size || 'Standard'}</p>
            </div>
          </div>


        </Card>

        <Card className='p-6'>
          <div className='space-y-1'>
            <p className='text-sm font-medium'>Progress</p>
            <div className='h-2 w-full bg-secondary rounded-full overflow-hidden'>
              <div
                className='h-full bg-primary transition-all duration-300 ease-in-out'
                style={{ width: '30%' }}
              />
            </div>
            <p className='text-xs text-muted-foreground mt-1'>5 Images generated</p>
          </div>
          <div className='space-y-1'>
            <p className='text-sm font-medium'>Progress</p>
            <div className='h-2 w-full bg-secondary rounded-full overflow-hidden'>
              <div
                className='h-full bg-primary transition-all duration-300 ease-in-out'
                style={{ width: '10%' }}
              />
            </div>
            <p className='text-xs text-muted-foreground mt-1'>{book?.pages ? book?.pages.length : 0} Pages Created</p>
          </div>
        </Card>

      </div>
      <PageGrid
        bookId={params.bookId}
        pages={book?.pages || []}
        onPageCreate={(page) => handlePageCreate(page)}
        onPageDelete={(pageId) => handlePageDelete(pageId)}
        isLoading={createPageMutation.isPending}
      />
    </div>
  );
}