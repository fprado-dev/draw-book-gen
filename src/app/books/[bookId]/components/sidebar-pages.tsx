import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { TPage } from '@/services/book.service';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  SensorDescriptor,
  SensorOptions,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader, Plus } from 'lucide-react';
import { SkeletonPages } from './skeleton-pages';
import { SortablePage } from './sortable-page';

type TAppSidebar = {
  sensors: SensorDescriptor<SensorOptions>[];
  handleDragEnd: (event: DragEndEvent) => void;
  setActiveId: (id: string) => void;
  data:
    | {
        pages: TPage[];
      }
    | undefined;
  handleCreatePage: (bookId: string) => void;
  handleDeletePage: (pageId: string) => void;
  isDeleting: boolean;
  handleOnSelectItem: (pageId: string) => void;
  selectedPageId: string | null;
  bookId: string;
  isLoading: boolean;
  activeId: string | null;
  isCreating: boolean;
};
export function AppSidebar({
  sensors,
  bookId,
  isLoading,
  handleDragEnd,
  setActiveId,
  data,
  handleCreatePage,
  isCreating,
  handleDeletePage,
  isDeleting,
  handleOnSelectItem,
  selectedPageId,
}: TAppSidebar) {
  return (
    <Sidebar>
      <SidebarHeader className="px-6">
        <Button
          size="sm"
          className="mt-3 w-full "
          onClick={() => handleCreatePage(bookId)}
        >
          {isCreating ? (
            <>
              Creating...
              <Loader className="h-4 w-4" />
            </>
          ) : (
            <>
              Create Page
              <Plus className="h-4 w-4" />
            </>
          )}
        </Button>
        {isLoading ? (
          <Skeleton className="mx-4 mt-2 h-8" />
        ) : (
          <span className="text-muted-foreground mt-2 text-center text-xs">{`${data?.pages && data?.pages.length === 1 ? `${data?.pages.length} Page` : `${data?.pages.length} Pages`} created!`}</span>
        )}
      </SidebarHeader>
      <SidebarContent className="p-0">
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
              {isLoading ? (
                <SkeletonPages />
              ) : (
                <SidebarMenu className="items-center justify-center gap-4 py-4">
                  <AnimatePresence>
                    {data?.pages &&
                      data.pages.length > 0 &&
                      data.pages.map((page, index) => (
                        <motion.div
                          key={page.id}
                          layout
                          initial={{ y: 100, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{
                            y: '50%',
                            opacity: 0,
                            transition: { duration: 0.1 },
                          }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <SidebarMenuItem
                            key={index}
                            onClick={() => handleOnSelectItem(page.id)}
                            className="relative"
                          >
                            <SortablePage
                              id={`page-${page.sequence_number}`}
                              currentId={page.id}
                              sequence_number={page.sequence_number}
                              image_url={page.image_url}
                              onDelete={handleDeletePage}
                              isSelected={selectedPageId === page.id}
                              isDeleting={isDeleting}
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
