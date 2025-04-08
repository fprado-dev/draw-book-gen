'use client';

import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Grab, Trash2 } from 'lucide-react';
import Image from 'next/image';

type SortablePageProps = {
  id: string;
  currentId: string;
  sequence_number: number;
  image_url: string;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  isSelected?: boolean;
};

export function SortablePage({
  currentId,
  sequence_number,
  image_url,
  onDelete,
  isDeleting,
  isSelected,
}: SortablePageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: currentId });

  const handleDelete = (id: string) => {
    onDelete(id);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: 1,
    border: isDragging
      ? '2px dashed var(--primary)'
      : '1px solid var(--border)',
  };

  return (
    <div className="relative transition-all">

      <div
        style={style}
        className="relative h-80 w-52 cursor-pointer overflow-hidden rounded-md transition-shadow hover:shadow-md"
      >
        {isDeleting && isSelected && <div className='flex w-full h-full items-center justify-center backdrop-blur-md bg-primary/15 dark:bg-primary-foreground/15 absolute top-0 left-0 z-10'>
          <span>Deleting...</span>
        </div>}

        <div className="absolute right-2 top-2  z-10 flex gap-2 ">

          <Button
            variant="secondary"
            size="icon"
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className="h-6 w-6  cursor-grab p-2"
          >
            <Grab className="h-3 w-3" />
          </Button>
          {isSelected && (
            <Button
              variant="secondary"
              size="icon"
              className="h-6 w-6 p-2"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(currentId);
              }}
            >
              <Trash2 className="text-destructive h-3 w-3" />
            </Button>
          )}
        </div>

        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-2 left-2 z-10"
            >
              <Button
                size="icon"
                className={`z-10 h-6 w-6 p-2 ${isSelected && 'bg-primary'}`}
              >
                <Check className="h-3 w-3" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={image_url}
            alt={`Page ${sequence_number}`}
            fill
            style={{ objectFit: 'cover' }}
            sizes="[min(256px) (100vw) 100vw]"
            priority
            className="rounded-sm"
          />
        </div>
      </div>
    </div>
  );
}
