'use client';

import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BoxSelect, Trash2 } from 'lucide-react';
import Image from 'next/image';

type SortablePageProps = {
  id: string;
  sequence_number: number;
  image_url: string;
  onDelete: (id: string) => void;
  isSelected?: boolean;
};

export function SortablePage({ id, sequence_number, image_url, onDelete, isSelected }: SortablePageProps) {
  const {
    attributes,
    listeners,
    active,
    setNodeRef,
    transform,
    transition,
    isDragging,

  } = useSortable({ id });


  const handleDelete = (id: string) => {
    console.log('deleting page', id);
    onDelete(id);
  };





  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: 1,
    border: isDragging ? '2px dashed var(--primary)' : isSelected ? '2px solid var(--primary)' : 'none',
  };


  return (
    <div className='relative'>
      <div
        style={style}
        className='w-52 h-64 rounded-md relative cursor-grab hover:shadow-md transition-shadow'
      >
        <Button
          variant="secondary"
          size="icon"
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          className="h-6 w-6 z-10 absolute top-2 left-2 p-2"

        >
          <BoxSelect className="h-3 w-3" />
        </Button>
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

        <Button
          variant="secondary"
          size="icon"
          className="h-6 w-6 z-10 absolute top-2 right-2 p-2"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(id);
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>

      </div>
    </div>
  );
}

