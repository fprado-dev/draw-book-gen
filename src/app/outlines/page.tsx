'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { generateBookOutline } from '@/services/replicate.service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CopyButton } from '@/components/ui/copy-button';

type Outline = {
  prompt: string;
  chapters: { title: string; description: string }[];
};

export default function OutlinesPage() {
  const [outlinePrompt, setOutlinePrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [chapterCount, setChapterCount] = useState('5');
  const [outlines, setOutlines] = useState<Outline[]>([]);

  const handleGenerateOutline = async () => {
    if (!outlinePrompt.trim()) {
      toast.error('Please provide a description for your book outline');
      return;
    }

    setLoading(true);
    try {
      const result = await generateBookOutline({
        prompt: outlinePrompt,
        complexity: 'detailed',
        chapters: parseInt(chapterCount)
      });

      if (result.success && result.outline) {
        if (typeof result.outline === 'string') {
          toast.error('Unexpected outline format received');
          return;
        }

        const chapters = result.outline.chapters;
        if (Array.isArray(chapters)) {
          setOutlines(prev => [{ prompt: outlinePrompt, chapters }, ...prev]);
          setOutlinePrompt('');
          toast.success('Book outline generated successfully!');
        } else {
          toast.error('Invalid outline format received');
        }
      } else {
        throw new Error(result.error || 'Failed to generate outline');
      }
    } catch (error) {
      console.error('Error generating outline:', error);
      toast.error('An error occurred while generating the outline');
    } finally {
      setLoading(false);
    }
  };


  const renderOutlineTabs = () => {
    if (outlines.length === 0) {
      return <p>No outlines generated yet.</p>;
    }
    return (
      <Accordion type="multiple" className="w-full">
        {outlines.map((outline, index) => (
          <AccordionItem key={index} value={index.toString()}>
            <AccordionTrigger className="text-left">{outline.prompt}</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4">
                {outline.chapters.map((chapter, chapterIndex) => (
                  <Card
                    key={chapterIndex}
                    className="overflow-hidden cursor-pointer transition-all duration-200 hover:bg-slate-50 p-4"
                    onClick={() => {
                      navigator.clipboard.writeText(chapter.description);
                      toast.success('Copied to clipboard!');
                      const card = document.getElementById(`outline-card-${chapterIndex}`);
                      if (card) {
                        card.style.border = '2px solid #22c55e';
                        setTimeout(() => {
                          card.style.border = '';
                        }, 1000);
                      }
                    }}
                    id={`outline-card-${chapterIndex}`}
                  >
                    <CardContent className="p-2">
                      <p className="text-sm text-muted-foreground">{chapter.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }


  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Book Outlines</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Outline
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create Book Outline</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-mono" htmlFor="outlinePrompt">
                  Create Your Book Outline (Be specific about genre, themes, and target audience for better results):
                </label>
                <Textarea
                  id="outlinePrompt"
                  className="border border-slate-400"
                  placeholder="Describe your book's content, themes, and structure..."
                  value={outlinePrompt}
                  onChange={(e) => setOutlinePrompt(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-mono" htmlFor="chapterCount">
                  Number of Chapters:
                </label>
                <Select value={chapterCount} onValueChange={setChapterCount}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select number of chapters" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Chapter' : 'Chapters'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerateOutline}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Generating...' : 'Generate Outline'}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div>
        {renderOutlineTabs()}

      </div>
    </div>
  );
}