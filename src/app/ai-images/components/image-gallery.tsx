'use client';

import { Card } from '@/components/ui/card';
import { CustomPagination } from '@/components/ui/custom-pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { AIGalleryImage, deleteAIImage, getAIGalleryImages } from '@/services/ai-gallery.service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { ImageDetailSheet } from './image-detail-sheet';

const ITEMS_PER_PAGE = 8;

function ImageGallerySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
        <div key={index} className="group flex flex-col gap-2 relative aspect-square overflow-hidden">
          <Skeleton className="h-full w-full animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function ImageGallery() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<AIGalleryImage | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const queryClient = useQueryClient();
  const { confirm, ConfirmDialog } = useConfirmDialog();

  const { data, isLoading } = useQuery({
    queryKey: ['ai-gallery', currentPage],
    queryFn: () =>
      getAIGalleryImages({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      }),
  });

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  if (isLoading) return <ImageGallerySkeleton />;

  if (!data || data?.images.length === 0) {
    return (
      <EmptyState
        title="No images yet"
        description="Generate some AI images to see them here"
      />
    );
  }

  const totalPages = Math.ceil((data?.totalCount || 0) / ITEMS_PER_PAGE);

  const handleDownload = (image: AIGalleryImage): void => {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.name || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (image: AIGalleryImage): Promise<void> => {
    console.log('handleDelete', image);
    const confirmed = await confirm({
      title: 'Delete Image',
      description: 'Are you sure you want to delete this image? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (!confirmed) return;

    try {
      await deleteAIImage(image.name);
      await queryClient.invalidateQueries({ queryKey: ['ai-gallery'] });
      setIsDetailOpen(false);
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast.error('Failed to delete image');
    }
  };
  return (
    <>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.images.map((image: AIGalleryImage) => (
          <Card
            key={image.id}
            className="group relative aspect-square overflow-hidden cursor-pointer"
            onClick={() => {
              setSelectedImage(image);
              setIsDetailOpen(true);
            }}
          >
            <Image
              src={image.url}
              alt={image.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <CustomPagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <ImageDetailSheet
        image={selectedImage}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />
      <ConfirmDialog options={{
        title: 'Delete Image',
        description: 'Are you sure you want to delete this image? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
      }} />
    </>
  );
}