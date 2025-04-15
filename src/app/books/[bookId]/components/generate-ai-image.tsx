import { mainQueryClient } from '@/components/providers';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { generateImage } from '@/services/image.service';
import { bookSizeAspectRatioMap, TBook } from '@/types/ebook';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import CreatingLoadingAnimation from './animation-loading';

function TabGenerateAIImage({
  prompt,
  setPromptText,
  setActiveTab,
  setIsGenerating,
  book,
}: {
  prompt: string;
  setPromptText: (prompt: string) => void;
  setActiveTab: (tab: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  book: TBook;
}) {
  const queryClient = useQueryClient(mainQueryClient);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [isCreatingImage, setIsCreatingImage] = useState(false);

  const handleCreateImage = async () => {
    try {
      setIsCreatingImage(true);
      setIsGenerating(true);
      const { success } = await generateImage({
        prompt: prompt,
        style: selectedStyle,
        aspectRatio: bookSizeAspectRatioMap[book.size],
      });
      if (success) {
        queryClient.refetchQueries({ queryKey: ['gallery-images'] }).then(() => {
          setIsCreatingImage(false);
          setIsGenerating(false);
          setActiveTab('gallery');
          toast.success('Image generated successfully!');
        });

      }
    } catch (error) {
      console.error('Failed to generate image:', error);
      toast.error('Failed to generate image. Please try again.');
      setIsCreatingImage(false);
      setIsGenerating(false);
    }
  };

  return (
    <ScrollArea className="h-[700px] w-full bg-red-200/5 px-4 py-4">
      <div className="flex flex-col gap-4">
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
          disabled={!prompt || isCreatingImage}
          onClick={handleCreateImage}
        >
          {isCreatingImage ? (
            <CreatingLoadingAnimation isCreating={isCreatingImage} />
          ) : (
            'Generate Image'
          )}
        </Button>
      </div>
    </ScrollArea>
  );
}

export default TabGenerateAIImage;
