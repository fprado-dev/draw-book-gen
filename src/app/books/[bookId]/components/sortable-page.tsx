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
  isSelected?: boolean;
};

export function SortablePage({ id, currentId, sequence_number, image_url, onDelete, isSelected }: SortablePageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,

    active

  } = useSortable({ id: currentId });


  const handleDelete = (id: string) => {
    onDelete(id);
  };





  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: 1,
    border: isDragging ? '2px dashed var(--primary)' : '1px solid var(--border)',
  };


  return (

    <div className='relative transition-all'>
      <div
        style={style}
        className='w-52 h-80 rounded-md relative cursor-pointer hover:shadow-md transition-shadow overflow-hidden'
      >
        <div className='absolute top-2 right-2  z-10 flex gap-2 '>
          <Button
            variant="secondary"
            size="icon"
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className="h-6 w-6  p-2 cursor-grab"
          >
            <Grab className="h-3 w-3" />
          </Button>
          {isSelected &&
            <Button
              variant="secondary"
              size="icon"
              className="h-6 w-6 p-2"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(currentId);
              }}
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          }
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

                className={`h-6 w-6 z-10 p-2 ${isSelected ? 'bg-primary text-white' : 'bg-white text-primary'}`}
              >
                <Check className="h-3 w-3" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={image_url}
            alt={`Page ${sequence_number}`}
            fill
            style={{ objectFit: 'cover' }}
            sizes='[min(256px) (100vw) 100vw]'
            priority
            className="rounded-sm"
          />
        </div>
      </div>
    </div>
  );
}

