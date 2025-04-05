import { BentoItem } from '@/components/ui/bento-card';
import { TOutlines } from '@/types/outlines';
import { formatDistanceToNow } from 'date-fns';
import { Sparkle } from 'lucide-react';

export const formatOutlineCard = (
  outlines: TOutlines[]
): BentoItem<TOutlines>[] => {
  const formattedOutlines = outlines.map((outline): BentoItem<TOutlines> => {
    return {
      id: outline.id,
      title: outline.title,
      status: `${outline.outlines.length} ${outline.outlines.length === 1 ? 'Prompt' : 'Prompts'}`,
      cta: 'Explore →',
      description: `${formatDistanceToNow(outline.created_at)} ago`,
      tags: outline.info.keywords,
      icon: <Sparkle className="text-primary h-4 w-4" />,
    };
  });
  return formattedOutlines;
};
