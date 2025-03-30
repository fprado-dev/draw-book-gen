import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';
import { TOutlines } from '@/types/outlines';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { CopyButton } from '@/components/ui/copy-button';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

type TViewPromptSheet = {
  isOpen: boolean;
  onOpenChange: (isViewing: boolean) => void;
  promptByOutlineId: TOutlines;
};
export function ViewPromptSheet({
  isOpen,
  onOpenChange,
  promptByOutlineId,
}: TViewPromptSheet) {
  const handleDownloadOutlinePrompts = () => {
    const promptContent = promptByOutlineId.outlines.map((outline) => {
      return {
        title: promptByOutlineId.title,
        created_at: promptByOutlineId.created_at,
        description: outline.description,
        keywords: outline.keywords,
      };
    });
    const jsonContent = JSON.stringify(promptContent, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${promptByOutlineId.title}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Prompts downloaded successfully!');
  };

  return (
    <Sheet onOpenChange={onOpenChange} open={isOpen}>
      <SheetContent className="min-w-4xl flex h-screen flex-col px-8 py-4 ">
        <div className="flex items-center justify-start gap-4">
          <SheetTitle>Generated Prompts</SheetTitle>
          <Button
            variant="outline"
            size="icon"
            className="gap-2"
            onClick={handleDownloadOutlinePrompts}
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
        <SheetDescription>
          Below are all the AI-generated prompts created for this outline.
          <br />
          Each prompt represents a different aspect or section of your content.
        </SheetDescription>

        <Separator className="my-4" />
        <div className="flex flex-grow flex-col overflow-hidden">
          <h3 className="text-primary mb-3 text-2xl font-bold">
            {promptByOutlineId.info.prompt}
          </h3>
          <div className="mb-4 flex flex-wrap gap-2">
            {promptByOutlineId.info.keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>

          <ScrollArea className="-mx-4 min-h-[600px] flex-1 px-4 py-4 ">
            <div className="grid grid-cols-2 gap-4">
              {promptByOutlineId.outlines.map((outline, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card className="flex h-[250px] flex-col justify-start gap-2 p-4">
                    <div className="mt-2 flex flex-wrap gap-2">
                      {outline.keywords.map((keyword, keywordIndex) => (
                        <Badge
                          key={keywordIndex}
                          variant="outline"
                          className="text-xs"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-muted-foreground max-h-[120px] overflow-y-auto text-sm">
                      {outline.description}
                    </p>
                    <div className="mt-auto flex justify-end pt-2">
                      <CopyButton value={outline.description} />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
