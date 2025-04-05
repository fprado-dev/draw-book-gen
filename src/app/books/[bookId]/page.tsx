'use client';

import { mainQueryClient } from '@/components/providers';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllPagesByBookId, getBookById, onCreatePage, TPage } from '@/services/book.service';
import { deletePage, updatePageImage, updatePageSequence } from '@/services/page.service';
import {
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, FilePlus } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AIImageSheet } from './components/ai-image-sheet';
import { FloatingToolbar } from './components/floating-toolbar';
import { AppSidebar } from './components/sidebar-pages';

export default function BookPages() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient(mainQueryClient);
  const [isAISheetOpen, setIsAISheetOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<TPage | null>(null);

  const { data: currentBook } = useQuery({
    queryKey: ['current-book', params.bookId],
    queryFn: () => getBookById(params.bookId! as string),
    enabled: !!params.bookId,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['pages-by-book-id', params.bookId],
    queryFn: () => getAllPagesByBookId(params.bookId! as string),
  });

  const deletePageMutation = useMutation({
    mutationFn: deletePage,
    mutationKey: ['delete-page'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages-by-book-id'] });
    },
  });

  useEffect(() => {
    if (data && data?.pages?.length > 0) {
      if (!selectedPage?.id) {
        setSelectedPage(data.pages[0]);
      }
    }
  }, [data?.pages]);


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && data?.pages) {
      const oldIndex = data.pages.findIndex((page) => page.id === active.id);
      const newIndex = data.pages.findIndex((page) => page.id === over.id);

      const newPages = arrayMove(data.pages, oldIndex, newIndex);

      const updates = newPages.map((page, index) => ({
        pageId: page.id,
        newSequence: index + 1,
      }));

      queryClient.setQueryData(['pages-by-book-id', params.bookId], {
        pages: newPages,
      });

      await updatePageSequence(updates);
    }

    setActiveId(null);
  }, [data?.pages, params.bookId, queryClient]);

  const handleCreatePage = useCallback(async (bookId: string) => {
    const data: TPage = await onCreatePage(bookId!);
    setSelectedPage(data);
    queryClient.invalidateQueries({
      queryKey: ['pages-by-book-id', params.bookId],
    });
  }, [params.bookId, queryClient]);

  const handleDeletePage = useCallback(async (pageId: string) => {
    deletePageMutation.mutate(pageId);
    setSelectedPage(data?.pages![0]!);

  }, []);

  const handleOnSelectItem = (pageId: string) => {
    console.log('handleOnSelectItem', pageId);
    setSelectedPage(data?.pages.find(page => page.id === pageId)!);
  };

  const getImageSelectedFromGallery = useCallback(async (url: string) => {
    if (selectedPage?.id) {
      await updatePageImage(selectedPage.id, url);
      await queryClient.invalidateQueries({
        queryKey: ['pages-by-book-id', params.bookId],
      }
      );
      const updatedData = queryClient.getQueryData<{ pages: TPage[]; }>(['pages-by-book-id', params.bookId]);
      const updatedPage = updatedData?.pages.find(page => page.id === selectedPage.id);
      if (updatedPage) {
        setSelectedPage(updatedPage);
      }
      setIsAISheetOpen(false);
    }
  }, [params.bookId, queryClient, selectedPage?.id]);

  const isEmptyState = useMemo(() => data?.pages?.length! <= 0, [data?.pages?.length]);




  return (
    <SidebarProvider>
      <AIImageSheet onClick={getImageSelectedFromGallery} open={isAISheetOpen} onOpenChange={setIsAISheetOpen} />

      <AppSidebar
        sensors={sensors}
        bookId={params.bookId! as string}
        data={data}
        handleCreatePage={handleCreatePage}
        handleDeletePage={handleDeletePage}
        handleOnSelectItem={handleOnSelectItem}
        handleDragEnd={handleDragEnd}
        setActiveId={setActiveId}
        activeId={activeId}
        selectedPageId={selectedPage?.id as string}
        isLoading={isLoading}
      />
      <main className='
      w-full relative h-screen
      group overflow-hidden rounded-xl p-4 transition-all duration-300
      dark:border-primary-foreground  border-accent-foreground/5 border dark:bg-black
      hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_2px_12px_rgba(255,255,255,0.08)]
      bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:4px_4px] will-change-transform hover:-translate-y-0.5 dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_1px,transparent_1px)]
      '>

        <div className='flex items-center justify-start w-full absolute top-5 left-5'>
          <SidebarTrigger />
          <Button
            size="sm"
            variant="ghost"
            className="text-sm "
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="w-full flex items-center justify-center h-full">
          <FloatingToolbar setIsAISheetOpen={setIsAISheetOpen} />
          {isEmptyState ? (
            <EmptyState
              title="Your book is empty"
              description="Create your first page by clicking the '+' button above"
              renderIcon={() => <FilePlus className='h-4 w-4' />} />
          ) : (
            <div className='flex h-[800px] w-full flex-col items-center justify-center'>
              {deletePageMutation.isPending && <Skeleton className='h-[800px] w-[600px] animatee animate-pulse' />}
              <>
                <AnimatePresence mode='popLayout' >
                  {data?.pages && selectedPage?.id && (
                    <motion.div
                      key={selectedPage.id}
                      layout
                      initial={{ y: 300, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: "100%", opacity: 0 }}
                      transition={{ duration: .3, ease: "anticipate", delay: 0.4, bounce: 0.4 }}

                    >
                      <Image
                        src={selectedPage.image_url}
                        alt={`Page ${selectedPage.sequence_number}`}
                        style={{ objectFit: 'contain' }}
                        priority
                        width={600}
                        height={900}
                        className="rounded-xl border-2 shadow-md aspect-auto"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            </div>
          )}
        </div>
      </main>
    </SidebarProvider>
  );
}

