'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { CopyIcon, DownloadIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Outline } from '@/types/outlines';

type OutlineSheetProps = {
  outline: Outline | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function OutlineSheet({ outline, isOpen, onOpenChange }: OutlineSheetProps) {
  if (!outline) return null;

  const handleCopyChapter = (chapterContent: string) => {
    navigator.clipboard.writeText(chapterContent);
    toast.success('Chapter copied to clipboard');
  };

  const handleCopyAll = () => {
    const allContent = outline.chapters
      .map((chapter, index) => `Chapter ${index + 1}: ${chapter.description}`)
      .join('\n\n');
    navigator.clipboard.writeText(allContent);
    toast.success('All chapters copied to clipboard');
  };

  const handleDownload = () => {
    const content = outline.chapters
      .map((chapter, index) => `Chapter ${index + 1}: ${chapter.description}`)
      .join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${outline.title.replace(/[^a-zA-Z0-9]/g, '_')}_outline.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Outline downloaded successfully');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] overflow-y-auto bg-white">
        <SheetHeader className="pb-6 border-b px-8 pt-6 bg-white bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:4px_4px]">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <SheetTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">{outline.title}</SheetTitle>
              <p className="text-sm text-muted-foreground font-medium">{outline.chapters.length} chapters generated</p>
            </div>
            <div className="flex gap-3">
              <Button
                size="sm"
                onClick={handleCopyAll}
                variant="secondary"
                className="cursor-pointer hover:opacity-90 bg-gradient-to-r from-primary  to-primary/80 text-white"
              >
                <CopyIcon className="h-4 w-4" />
                Copy All
              </Button>
              <Button
                size="sm"
                onClick={handleDownload}
                variant="secondary"
                className="cursor-pointer hover:opacity-90 bg-gradient-to-r from-primary  to-primary/80 text-white"

              >
                <DownloadIcon className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </SheetHeader>
        <div className="p-8 grid grid-cols-3 gap-6">
          {outline.chapters.map((chapter, index) => (
            <div
              key={index}
              className="group cursor-pointer relative p-6 rounded-2xl border bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
              </div>
              <div className="relative space-y-3">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyChapter(chapter.description)}
                    className="cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 text-xs hover:bg-primary/10 text-primary"
                  >
                    Copy to Clipboard
                    <CopyIcon className="h-1 w-1" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {chapter.description.replace(/[\*]/g, '')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}