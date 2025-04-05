import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { TPage } from '@/services/book.service';
import { closestCenter, DndContext, DragEndEvent, SensorDescriptor } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from 'lucide-react';
import { SkeletonPages } from "./skeleton-pages";
import { SortablePage } from "./sortable-page";

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
  isLoading: boolean;
  activeId: string | null;
};
export function AppSidebar({ sensors, bookId, isLoading, handleDragEnd, setActiveId, data, handleCreatePage, handleDeletePage, handleOnSelectItem, selectedPageId }: TAppSidebar) {


  return (
    <Sidebar >
      <SidebarHeader className="px-6">
        <Button
          size="sm"
          className="w-full mt-3 "

          onClick={() => handleCreatePage(bookId)}
        >
          New Page
          <Plus className="h-4 w-4" />
        </Button>
        {isLoading ? <Skeleton className="h-8 mx-4 mt-2" /> : <span className="text-muted-foreground text-xs text-center mt-2">{`${data?.pages && data?.pages.length === 1 ? `${data?.pages.length} Page` : `${data?.pages.length} Pages`} created!`}</span>}
      </SidebarHeader>
      <SidebarContent className='p-0'>
        <div className="flex flex-col items-center justify-center">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={(event) => setActiveId(event.active.id as string)}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={data?.pages || []}
              strategy={verticalListSortingStrategy}

            >

              {isLoading ? <SkeletonPages /> : (

                <SidebarMenu className='gap-4 items-center justify-center py-4'>
                  <AnimatePresence>
                    {data?.pages &&
                      data.pages.length > 0 &&
                      data.pages.map((page, index) => (
                        <motion.div
                          key={page.id}
                          layout
                          initial={{ y: 100, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: "100%", opacity: 0 }}
                          transition={{ duration: .3, delay: index * 0.1, }}

                        >
                          <SidebarMenuItem key={index} onClick={() => handleOnSelectItem(page.id)}>
                            <SortablePage
                              id={`page-${page.sequence_number}`}
                              currentId={page.id}
                              sequence_number={page.sequence_number}
                              image_url={page.image_url}
                              onDelete={handleDeletePage}
                              isSelected={selectedPageId === page.id}
                            />
                          </SidebarMenuItem>
                        </motion.div>

                      ))}
                  </AnimatePresence>
                </SidebarMenu>
              )}
            </SortableContext>
          </DndContext>
        </div>
      </SidebarContent>

    </Sidebar>
  );
}