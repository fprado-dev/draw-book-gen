import { mainQueryClient } from '@/components/providers';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
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
import { Clock } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

function TabGenerateAIImage({
  prompt,
  setPromptText,
  setActiveTab,
  book,
}: {
  prompt: string;
  setPromptText: (prompt: string) => void;
  setActiveTab: (tab: string) => void;
  book: TBook;
}) {
  const queryClient = useQueryClient(mainQueryClient);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [isCreatingImage, setIsCreatingImage] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60);

  const handleCreateImage = async () => {
    try {
      setIsCreatingImage(true);
      // Start a countdown timer when image generation begins
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      const { success } = await generateImage({
        prompt: prompt,
        style: selectedStyle,
        aspectRatio: bookSizeAspectRatioMap[book.size],
      });
      if (success) {
        // Clean up timer when component unmounts or generation completes
        setTimeout(() => {
          clearInterval(timer);
          setRemainingTime(60);
        }, 60000);
        queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
        setIsCreatingImage(false);
        setActiveTab('gallery');
        toast.success('Image generated successfully!');
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
      toast.error('Failed to generate image. Please try again.');
      setIsCreatingImage(false);
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
        {isCreatingImage && (
          <div className="space-y-2">
            <Alert className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  Generating image... this could take a minute or two...
                </span>
              </div>
              <Progress
                value={((60 - remainingTime) / 60) * 100}
                className="h-1"
              />
            </Alert>
          </div>
        )}
        <Button
          className="w-full"
          disabled={!prompt || isCreatingImage}
          onClick={handleCreateImage}
        >
          {isCreatingImage ? 'Generating...' : 'Generate Image'}
        </Button>
      </div>
    </ScrollArea>
  );
}

export default TabGenerateAIImage;
