import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/copy-button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';
import { TOutlines } from '@/types/outlines';
import { motion } from 'framer-motion';
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
      <SheetContent className="min-w-2xl flex h-screen flex-col px-8 py-4 ">
        <div className="flex items-center justify-start gap-4">
          <SheetTitle>Generated Prompts</SheetTitle>
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
          <div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleDownloadOutlinePrompts}
            >
              <span>Download All Prompts</span>
              <Download className="h-3 w-3" />
            </Button>
          </div>

          <ScrollArea className="-mx-4 min-h-[600px] flex-1 px-4 py-4 ">
            <div className="grid grid-cols-1 gap-4">
              {promptByOutlineId.outlines.map((outline, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card className="flex flex-col  gap-4">
                    <CardHeader className="flex items-center justify-between gap-2">
                      <div className="flex gap-2">
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
                      <CopyButton value={outline.description} />
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground max-h-[120px] overflow-y-auto text-sm">
                        {outline.description}
                      </p>
                    </CardContent>
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
