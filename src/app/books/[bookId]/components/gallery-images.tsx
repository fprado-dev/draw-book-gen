import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { getGeneratedImages } from '@/services/supabase-storage.service';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

function TabGalleryImages({
  onSelectItemFromGallery,
}: {
  onSelectItemFromGallery: (url: string) => void;
}) {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: getGeneratedImages,
  });

  if (isLoading || isFetching) {
    return (
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="group flex flex-col gap-2 relative aspect-square overflow-hidden">
            <Skeleton className="h-full w-full animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[700px] w-full bg-red-200/5 px-4 py-4">
      {data?.length === 0 && (
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <span className="text-muted-foreground text-sm">
            No images in your gallery yet!
          </span>
          <span className="text-muted-foreground text-sm">
            Visit the Generate Images tab to create your first image.
          </span>
        </div>
      )}
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2">
        {data?.map((image: { name: string; url: string; }, index: number) => (
          <Card key={image.name} className="w-full gap-1 overflow-hidden p-1">
            <CardContent className="p-0">
              <div className="relative h-72 w-full">
                {index < 4 && (
                  <Badge className="bg-primary text-primary-foreground absolute right-2 top-2 z-10">
                    New
                  </Badge>
                )}
                <Image
                  src={image.url}
                  alt={image.name}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            </CardContent>
            <CardFooter className="p-0">
              <Button
                onClick={() => onSelectItemFromGallery(image.url)}
                size="sm"
                variant="outline"
                className="w-full text-xs"
              >
                Use this image
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

export default TabGalleryImages;
