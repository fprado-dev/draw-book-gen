import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getAllOutlines } from '@/services/outlines.service';
import { TOutlines } from '@/types/outlines';
import { useQuery } from '@tanstack/react-query';
import { Sparkle } from 'lucide-react';
import { useState } from 'react';

type TabOutlinesProps = {
  onDescriptionSelect: (description: string) => void;
};

function TabOutlines({ onDescriptionSelect }: TabOutlinesProps) {
  const [selectedOutlineId, setSelectedOutlineId] = useState<string>('');
  const { data: outlines, isLoading: isLoadingOutlines } = useQuery({
    queryKey: ['outlines'],
    queryFn: getAllOutlines,
  });

  if (isLoadingOutlines) {
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
      {outlines?.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <span className="text-muted-foreground text-sm">
            No outlines yet!
          </span>
          <span className="text-muted-foreground text-sm">
            Visit the Outlines to create your first image.
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          <Select
            value={selectedOutlineId}
            onValueChange={setSelectedOutlineId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an outline" />
            </SelectTrigger>
            <SelectContent>
              {outlines?.data?.map((outline: TOutlines) => (
                <SelectItem key={outline.id} value={outline.id}>
                  {outline.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="space-y-4">
            {outlines?.data
              ?.filter(
                (outline: TOutlines) =>
                  !selectedOutlineId || outline.id === selectedOutlineId
              )
              ?.map((outline: TOutlines) => (
                <div key={outline.id} className="space-y-4">
                  <h3 className="text-lg font-semibold">{outline.title}</h3>
                  {outline.outlines.map((item, index) => (
                    <Card key={index} className="w-full overflow-hidden">
                      <CardHeader>
                        <p className="text-muted-foreground text-sm">
                          {item.description}
                        </p>
                      </CardHeader>
                      <CardContent className="px-4">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="wf col-span-2 mt-2 flex flex-1 flex-wrap gap-2">
                            {item.keywords.map((keyword, keywordIndex) => (
                              <Badge
                                key={keywordIndex}
                                variant="secondary"
                                className="text-xs"
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex justify-end">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  className="cursor-pointer"
                                  onClick={() =>
                                    onDescriptionSelect(item.description)
                                  }
                                >
                                  <Sparkle className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                <p className="text-sm">Use this prompt</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))}
          </div>
        </div>
      )}
    </ScrollArea>
  );
}

export default TabOutlines;
