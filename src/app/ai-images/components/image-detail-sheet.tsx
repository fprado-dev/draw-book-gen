'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { AIGalleryImage } from '@/services/ai-gallery.service';
import { formatDistance } from 'date-fns';
import { Download, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface ImageDetailSheetProps {
  image: AIGalleryImage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload?: (image: AIGalleryImage) => void;
  onDelete?: (image: AIGalleryImage) => void;
}

export function ImageDetailSheet({
  image,
  open,
  onOpenChange,
  onDownload,
  onDelete,
}: ImageDetailSheetProps) {
  if (!image) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="mx-auto flex w-full items-center py-4 sm:max-w-2xl">
        <SheetHeader className="space-y-4">
          <SheetTitle className="text-muted-foreground text-xs">
            Created{' '}
            {formatDistance(image.created_at, new Date(), { addSuffix: true })}
          </SheetTitle>
        </SheetHeader>

        <div className="relative mx-auto  aspect-[2/3] w-[500px] overflow-clip rounded-lg border bg-red-200">
          <Image
            src={image.url}
            alt={image.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <SheetFooter>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => onDownload?.(image)}
            >
              Download
              <Download className="h-3 w-3" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="cursor-pointer text-xs"
              onClick={() => onDelete?.(image)}
            >
              Delete
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
