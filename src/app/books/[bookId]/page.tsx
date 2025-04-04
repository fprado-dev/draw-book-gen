'use client';

import { mainQueryClient } from '@/components/providers';
import { Button } from '@/components/ui/button';
import { SidebarContent, SidebarMenu, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { getAllPagesByBookId, onCreatePage, TPage } from '@/services/book.service';
import { deletePage, updatePageSequence } from '@/services/page.service';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  SensorDescriptor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SortablePage } from './components/sortable-page';

export default function BookPages() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient(mainQueryClient);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ['pages-by-book-id', params.bookId],
    queryFn: () => getAllPagesByBookId(params.bookId! as string),
  });
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  useEffect(() => {
    if (data && data?.pages?.length > 0) {
      setSelectedPageId(data.pages[0].id);
    }
  }, [data?.pages]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );



  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && data?.pages) {
      const oldIndex = data.pages.findIndex((page) => page.id === active.id);
      const newIndex = data.pages.findIndex((page) => page.id === over.id);

      const newPages = arrayMove(data.pages, oldIndex, newIndex);

      // Prepare sequence updates
      const updates = newPages.map((page, index) => ({
        pageId: page.id,
        newSequence: index + 1,
      }));

      // Optimistically update the UI
      queryClient.setQueryData(['pages-by-book-id', params.bookId], {
        pages: newPages,
      });

      // Update the sequence numbers in the database
      await updatePageSequence(updates);
    }

    setActiveId(null);
  };



  const handleCreatePage = async (bookId: string) => {
    await onCreatePage(bookId!);
    queryClient.invalidateQueries({
      queryKey: ['pages-by-book-id', params.bookId],
    });
  };

  const handleDeletePage = async (pageId: string) => {
    await deletePage(pageId);
    queryClient.invalidateQueries({
      queryKey: ['pages-by-book-id', params.bookId],
    });
  };


  const handleOnSelectItem = (pageId: string) => {
    setSelectedPageId(pageId);
  };
  return (
    <SidebarProvider>
      <AppSidebar
        sensors={sensors}
        bookId={params.bookId! as string}
        data={data}
        handleCreatePage={handleCreatePage}
        handleDeletePage={handleDeletePage}
        handleOnSelectItem={handleOnSelectItem}
        handleDragEnd={handleDragEnd}
        setActiveId={setActiveId}
        selectedPageId={selectedPageId}
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
          <FloatingToolbar />

          <div className='flex h-[800px] w-full items-center justify-center'>
            {data?.pages && selectedPageId && (
              <Image
                src={data.pages.find(page => page.id === selectedPageId)?.image_url || ''}
                alt={`Page ${data.pages.find(page => page.id === selectedPageId)?.sequence_number}`}
                style={{ objectFit: 'cover' }}
                width={600}
                height={900}
                className="rounded-xl border-2 shadow-md"
              />

            )}
          </div>
        </div>
      </main>
    </SidebarProvider>
    // <div className="grid grid-cols-6">
    //   {/* SIDEBAR */}
    //   <div className="col-span-1 border-r bg-sidebar fixed h-screen w-xs">
    //     <ScrollArea className="h-full data-[state]:visible py-10 -mx-2">
    //       {isLoading && <SkeletonPages />}
    //       <div className="flex flex-col gap-6 items-center justify-center">
    //         <DndContext
    //           sensors={sensors}
    //           collisionDetection={closestCenter}
    //           onDragEnd={handleDragEnd}
    //           onDragStart={(event) => setActiveId(event.active.id as string)}

    //         >
    //           <SortableContext
    //             items={data?.pages || []}
    //             strategy={verticalListSortingStrategy}

    //           >
    //             {data?.pages &&
    //               data.pages.length > 0 &&
    //               data.pages.map((page) => (
    //                 <SortablePage
    //                   key={page.id}
    //                   id={page.id}
    //                   sequence_number={page.sequence_number}
    //                   image_url={page.image_url}
    //                   onDelete={handleDeletePage}
    //                   onClick={() => handleOnSelectItem(page.id)}
    //                   isSelected={selectedPageId === page.id}
    //                 />
    //               ))}
    //           </SortableContext>
    //         </DndContext>
    //         <div className='flex w-full items-center justify-center'>
    //           <Button
    //             size="icon"
    //             variant="ghost"
    //             onClick={() => handleCreatePage(params.bookId! as string)}
    //           >
    //             <Plus className="h-4 w-4" />
    //           </Button>
    //         </div>
    //       </div>
    //     </ScrollArea>
    //   </div>

    //   {/* EDIT 2 */}
    //   <div className="col-span-5 w-full">
    //     {/* <FloatingToolbar /> */}
    //     <div className='flex flex-col w-full' >
    //       <div className='flex items-center justify-start w-full h-10 bg-amber-200'>
    //         <Button
    //           size="sm"
    //           variant="ghost"
    //           className="text-sm "
    //           onClick={() => router.back()}
    //         >
    //           <ArrowLeft className="h-4 w-4" />
    //           Back
    //         </Button>
    //       </div>
    //       <div className='flex h-[calc(100vh-2.5rem)] w-full items-center justify-center bg-red-200'>
    //         {data?.pages && selectedPageId && (
    //           <div className="relative h-screen w-xl" >
    //             <Image
    //               src={data.pages.find(page => page.id === selectedPageId)?.image_url || ''}
    //               alt={`Page ${data.pages.find(page => page.id === selectedPageId)?.sequence_number}`}
    //               fill
    //               style={{ objectFit: 'contain' }}
    //               className="rounded-sm"
    //             />
    //           </div>

    //         )}
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

import { FloatingToolbar } from '@/components/ui/floating-toolbar';
import { Sidebar } from "@/components/ui/sidebar";

type TAppSidebar = {
  sensors: SensorDescriptor<any>[];
  handleDragEnd: (event: DragEndEvent) => void;
  setActiveId: (id: string) => void;
  data: {
    pages: TPage[];
  } | undefined;
  handleCreatePage: (bookId: string) => void;
  handleDeletePage: (pageId: string) => void;
  handleOnSelectItem: (pageId: string) => void;
  selectedPageId: string | null;
  bookId: string;
};
export function AppSidebar({ sensors, bookId, handleDragEnd, setActiveId, data, handleCreatePage, handleDeletePage, handleOnSelectItem, selectedPageId }: TAppSidebar) {
  return (
    <Sidebar >
      {/* <ScrollArea className="h-full data-[state]:visible py-10 -mx-2"> */}
      <SidebarContent className='gap-4'>
        <div className="flex flex-col gap-6 items-center justify-center">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={(event) => setActiveId(event.active.id as string)}

          >
            <SortableContext
              items={data?.pages || []}
              strategy={verticalListSortingStrategy}

            >
              <SidebarMenu className='gap-4 items-center justify-center py-8'>
                {data?.pages &&
                  data.pages.length > 0 &&
                  data.pages.map((page) => (
                    <SidebarMenuItem key={page.id} onClick={() => handleOnSelectItem(page.id)}>
                      <SortablePage
                        id={page.id}
                        sequence_number={page.sequence_number}
                        image_url={page.image_url}
                        onDelete={handleDeletePage}
                        isSelected={selectedPageId === page.id}
                      />
                    </SidebarMenuItem>

                  ))}
              </SidebarMenu>
            </SortableContext>
          </DndContext>
          <div className='flex w-full items-center justify-center'>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleCreatePage(bookId)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

      </SidebarContent>
      {/* </ScrollArea> */}
    </Sidebar>);
}