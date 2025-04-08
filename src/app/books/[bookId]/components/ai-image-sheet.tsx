'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getBookById } from '@/services/book.service';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import TabGalleryImages from './gallery-images';
import TabGenerateAIImage from './generate-ai-image';
import TabOutlines from './outlines';

type AIImageSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClick: (url: string) => void;
};

export function AIImageSheet({
  open,
  onOpenChange,
  onClick,
}: AIImageSheetProps) {
  const [activeTab, setActiveTab] = useState('generate-image');
  const [promptText, setPromptText] = useState('');
  const params = useParams();

  const { data: book } = useQuery({
    queryKey: ['book-by-id', params.bookId],
    queryFn: () => getBookById(params.bookId! as string),
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-xl px-4" side="right">
        <SheetHeader className="p-0 py-4">
          <SheetTitle>Generate AI Image</SheetTitle>
          <SheetDescription>
            Generate AI images with ease. Choose a style, add a prompt, and
            generate your images.
          </SheetDescription>
        </SheetHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate-image">Generate Images</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="outlines">Outlines</TabsTrigger>
          </TabsList>

          <TabsContent value="generate-image" className="space-y-4 py-4">
            <TabGenerateAIImage book={book!} prompt={promptText} setPromptText={setPromptText} setActiveTab={setActiveTab} />
          </TabsContent>

          <TabsContent value="gallery" className="h-10/12 space-y-4 px-2 py-4">
            <TabGalleryImages onSelectItemFromGallery={onClick} />
          </TabsContent>

          <TabsContent value="outlines" className="space-y-4 py-4">
            <TabOutlines
              onDescriptionSelect={(description) => {
                setPromptText(description);
                setActiveTab('generate-image');
              }}
            />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
