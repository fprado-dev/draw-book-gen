'use client';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import TabGalleryImages from './gallery-images';
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
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('generate-image');
  const [promptText, setPromptText] = useState('');

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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Prompt</Label>
                <Textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Describe the image you want to generate..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Style</Label>
                <Select>
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

              <Collapsible
                open={isAdvancedOpen}
                onOpenChange={setIsAdvancedOpen}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full p-0">
                      <h4 className="text-sm font-semibold">
                        Advanced Options
                      </h4>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Negative Prompt</Label>
                    <Textarea
                      placeholder="What to exclude from the generation..."
                      className="min-h-[60px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Seed</Label>
                    <input
                      type="number"
                      className="w-full rounded-md border px-3 py-2"
                      placeholder="Random seed"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Steps</Label>
                    <input
                      type="number"
                      className="w-full rounded-md border px-3 py-2"
                      placeholder="Number of steps"
                      min={1}
                      max={150}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Button className="w-full">Generate</Button>
            </div>
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
