import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { generateImage } from '@/services/image.service';
import { getGeneratedImages, saveGeneratedImage } from '@/services/supabase-storage.service';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

function TabGenerateAIImage({
  onSelectItemFromGallery,
  prompt,
  setPromptText
}: {
  onSelectItemFromGallery: (url: string) => void;
  prompt: string;
  setPromptText: (prompt: string) => void;
}) {
  const [selectedStyle, setSelectedStyle] = useState('');
  const [isCreatingImage, setIsCreatingImage] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: getGeneratedImages,
  });

  const firstFourImages = data?.slice(0, 4);
  const handleCreateImage = async () => {
    try {
      setIsCreatingImage(true);
      const { output, success } = await generateImage({
        prompt: prompt,
        style: selectedStyle,
      });
      if (success) {
        output.forEach(async image => {
          await saveGeneratedImage(image);
        });
        setIsCreatingImage(false);
        toast.success('Image generated successfully!');
      }
    } catch (error) {
      toast.error('Failed to generate image. Please try again.');
      setIsCreatingImage(false);
    }
  };


  if (isLoading) {
    return (
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="w-full overflow-hidden">
            <CardContent>
              <div className="relative h-40">
                <Skeleton className="h-full w-full rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[700px] w-full bg-red-200/5 px-4 py-4">
      <div className='flex flex-col gap-4'>
        <div className="space-y-2">
          <Label>Prompt</Label>
          <Textarea
            value={prompt}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label>Style</Label>
          <Select value={selectedStyle} onValueChange={setSelectedStyle}>
            <SelectTrigger>
              <SelectValue placeholder="Select a style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kawaii">Kawaii</SelectItem>
              <SelectItem value="ghibli">Ghibli</SelectItem>
              <SelectItem value="anime">Anime</SelectItem>
              <SelectItem value="realistic">Realistic</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          className="w-full"
          disabled={!prompt || isLoading || isCreatingImage}
          onClick={handleCreateImage}>
          {isCreatingImage ? 'Generating...' : 'Generate Image'}
        </Button>
      </div>
      {data?.length === 0 && (

        <div className="flex flex-col items-center justify-center p-4 text-center">
          <span className="text-muted-foreground text-sm">
            No images in your gallery yet!
          </span>
          <span className="text-muted-foreground text-sm">
            Visit the Generate Images tab to create your first image.
          </span>
        </div>
      )
      }
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 my-4">
        {firstFourImages?.map((image: { name: string; url: string; }) => (
          <Card key={image.name} className="w-full gap-1 overflow-hidden p-1">
            <CardContent className="p-0">
              <div className="relative h-72 w-full">
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
    </ScrollArea >
  );
}

export default TabGenerateAIImage;
