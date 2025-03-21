/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

'use client';

import { useState } from 'react';
import { OutlineSheet } from './components/outline-sheet';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SparklesIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { toast } from 'sonner';
import { Outline, OutlinesService } from '@/services/outlines.service';
import * as ReplicateServices from "@/services/replicate.service";
import { BentoCard, BentoItem } from '@/components/ui/bento-card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';


export default function OutlinesPage() {
  const queryClient = useQueryClient();
  const [outlinePrompt, setOutlinePrompt] = useState('');
  const [selectedOutline, setSelectedOutline] = useState<Outline | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [chapterCount, setChapterCount] = useState('5');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const { data: outlines, isLoading: isLoadingOutlines } = useQuery({
    queryKey: ['generate-outlines', currentPage],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to generate outlines');
        return;
      }
      const outlinesService = new OutlinesService();
      return await outlinesService.getOutlinesByUserId(user.id, currentPage, itemsPerPage);
    }
  })

  const onGenerateAIOutline = useMutation({
    mutationFn: async () => {
      return await ReplicateServices.generateBookOutline({
        prompt: outlinePrompt,
        chapters: parseInt(chapterCount),
      })
    },
    onSuccess: async (data) => {
      if (data.success && data.outline) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            toast.error('You must be logged in to save outlines');
            return;
          }

          const outlinesService = new OutlinesService();
          const result = await outlinesService.createOutline({
            title: outlinePrompt,
            user_id: user.id,
            chapters: data.outline.chapters
          });

          if (result.success) {
            toast.success('Outline generated and saved successfully!');
            setOutlinePrompt('');
            queryClient.invalidateQueries({
              queryKey: ['generate-outlines'],
            });
          } else {
            toast.error(result.error || 'Failed to save outline');
          }
        } catch (error) {
          console.error('Error saving outline:', error);
          toast.error('Failed to save the outline');
        }
      } else {
        toast.error('Failed to generate outline');
      }
    },
    onError: (error: unknown) => {
      console.error('Error generating outline:', error);
      toast.error('An error occurred while generating the outline');
    }
  })


  const handleGenerateOutline = () => {
    onGenerateAIOutline.mutate()
  }

  const formatCardOutlines = (outlines: Outline[]): BentoItem<Outline>[] => {

    const formattedOutlines = outlines.map((outline): BentoItem<Outline> => {
      return {
        title: outline.title,
        description: outline.chapters[3]?.description?.slice(0, 80).replace(/[\*]/g, '') + '...',
        tags: outline.chapters[3]?.description?.split(' ').slice(0, 3).map(word => word.replace(/[^a-zA-Z]/g, '')) || [],
        cta: 'Explore →',
        status: `${outline.chapters.length} Prompts`,
        icon: <SparklesIcon className="w-4 h-4 text-purple-500" />,
        meta: outline,

      }
    })
    return formattedOutlines
  }

  const handleClickCard = (outline: Outline) => {
    setSelectedOutline(outline);
    setIsSheetOpen(true);
  }
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">

        <div className="flex flex-col gap-8 py-4 md:gap-6 md:py-6">
          <div className="mx-6">
            <h1 className="text-3xl font-bold text-primary">Outlines</h1>
            <p className="text-muted-foreground mt-2">Harness our AI to create detailed book outlines and chapter structures tailored to your story!</p>
          </div>
          <div className="px-4 lg:px-6 flex flex-col gap-8">
            <div className='flex items-center justify-between gap-2'>
              <Input
                placeholder="Describe a little about what you want. (e.g. Cute and Cozy Gardens)"
                value={outlinePrompt}
                className="w-full py-3 px-4 text-sm text-muted-foreground placeholder:text-muted-foreground bg-transparent rounded-md border border-muted-foreground/10 focus:border-primary focus-visible:ring-0 focus:ring-0 focus:outline-none "
                onChange={(e) => setOutlinePrompt(e.target.value)} />

              <Select value={chapterCount} onValueChange={setChapterCount}>
                <SelectTrigger className='w-2xs focus-visible:ring-0 cursor-pointer'>
                  <SelectValue placeholder="Select number of chapters" />
                </SelectTrigger>
                <SelectContent className='w-fit'>
                  {[5, 10, 20].map((num) => (
                    <SelectItem
                      key={num}
                      value={num.toString()}
                      disabled={num !== 5}
                      className='w-full flex items-center justify-between cursor-pointer'
                    >
                      <span>{num} Chapters</span>
                      {num !== 5 && (
                        <Badge variant="default">
                          Pro
                        </Badge>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button disabled={onGenerateAIOutline.isPending} onClick={handleGenerateOutline} variant="secondary" className="cursor-pointer hover:opacity-90 bg-gradient-to-r from-primary  to-primary/80 text-white">
                <SparklesIcon className="mr-2 h-4 w-4" />
                {onGenerateAIOutline.isPending ? "Generating..." : "Generate Now"}
              </Button>
            </div>

            {isLoadingOutlines ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm animate-pulse">
                    <div className="space-y-3">
                      <div className="h-4 w-3/4 bg-muted rounded"></div>
                      <div className="h-3 w-full bg-muted rounded"></div>
                      <div className="h-3 w-2/3 bg-muted rounded"></div>
                      <div className="flex gap-2 pt-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-6 w-16 bg-muted rounded-full"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : outlines?.data && outlines.data.length > 0 ? (
              <>
                <BentoCard
                  items={formatCardOutlines(outlines.data)}
                  onClick={handleClickCard}
                />
                <OutlineSheet
                  outline={selectedOutline}
                  isOpen={isSheetOpen}
                  onOpenChange={setIsSheetOpen}
                />
                {outlines.total && outlines.total > itemsPerPage && (
                  <div className="flex justify-center mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) setCurrentPage(currentPage - 1);
                            }}
                          />
                        </PaginationItem>
                        {Array.from({ length: Math.ceil(outlines.total / itemsPerPage) }).map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === i + 1}
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(i + 1);
                              }}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < Math.ceil(outlines?.total! / itemsPerPage)) {
                                setCurrentPage(currentPage + 1);
                              }
                            }}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                title="No Outlines Yet"
                description="Start creating detailed book outlines with AI assistance. Generate chapter structures tailored to your story!"
                actionLabel="Generate Your First Outline"
                onAction={handleGenerateOutline}
              />

            )}
          </div>
        </div>
      </div>
    </div>
  );
}
