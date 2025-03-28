'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { CopyIcon, DownloadIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Outline } from '@/types/outlines';

type OutlineSheetProps = {
  outline: Outline | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function OutlineSheet({
  outline,
  isOpen,
  onOpenChange,
}: OutlineSheetProps) {
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
        <SheetHeader className="border-b bg-white bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:4px_4px] px-8 pb-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <SheetTitle className="from-primary to-primary/80 bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                {outline.title}
              </SheetTitle>
              <p className="text-muted-foreground text-sm font-medium">
                {outline.chapters.length} chapters generated
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                size="sm"
                onClick={handleCopyAll}
                variant="secondary"
                className="from-primary to-primary/80 cursor-pointer bg-gradient-to-r  text-white hover:opacity-90"
              >
                <CopyIcon className="h-4 w-4" />
                Copy All
              </Button>
              <Button
                size="sm"
                onClick={handleDownload}
                variant="secondary"
                className="from-primary to-primary/80 cursor-pointer bg-gradient-to-r  text-white hover:opacity-90"
              >
                <DownloadIcon className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </SheetHeader>
        <div className="grid grid-cols-3 gap-6 p-8">
          {outline.chapters.map((chapter, index) => (
            <div
              key={index}
              className="hover:border-primary/20 group relative cursor-pointer rounded-2xl border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
              </div>
              <div className="relative space-y-3">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyChapter(chapter.description)}
                    className="hover:bg-primary/10 text-primary cursor-pointer text-xs opacity-0 transition-all duration-200 group-hover:opacity-100"
                  >
                    Copy to Clipboard
                    <CopyIcon className="h-1 w-1" />
                  </Button>
                </div>
                <p className="text-muted-foreground/90 whitespace-pre-wrap text-sm leading-relaxed">
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
