import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { getGeneratedImages } from "@/services/supabase-storage.service";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

function TabGalleryImages({ onSelectItemFromGallery }: { onSelectItemFromGallery: (url: any) => void; }) {
  const { data, isLoading } = useQuery({
    queryKey: ["gallery-images"],
    queryFn: getGeneratedImages
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden w-full">
            <CardContent>
              <div className="h-40 relative">
                <Skeleton className="w-full h-full rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="w-full py-4 px-4 bg-red-200/5 h-[700px]">
      {data?.length === 0 && (
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <span className="text-sm text-muted-foreground">No images in your gallery yet!</span>
          <span className="text-sm text-muted-foreground">Visit the Generate Images tab to create your first image.</span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {data?.map((image: any) => (
          <Card key={image.name} className="overflow-hidden w-full p-1 gap-1">
            <CardContent className="p-0">
              <div className="h-72 w-full relative">
                <Image
                  src={image.url}
                  alt={image.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </CardContent>
            <CardFooter className="p-0">
              <Button onClick={() => onSelectItemFromGallery(image.url)} size="sm" variant="outline" className="text-xs w-full">
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