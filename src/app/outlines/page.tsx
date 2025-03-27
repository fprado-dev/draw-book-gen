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
import { BentoCard, BentoItem } from '@/components/ui/bento-card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';

import { Outline } from '@/types/outlines';
import { PageHeader } from '@/components/page-header';
import { PageWrapper } from '@/components/page-wrapper';

import * as ReplicateServices from "@/services/replicate.service";
import { createOutline, deleteOutline, getOutlinesByUserId } from '@/services/outlines.service';


export default function OutlinesPage() {
  const queryClient = useQueryClient();
  const [outlinePrompt, setOutlinePrompt] = useState('');
  const [selectedOutline, setSelectedOutline] = useState<Outline | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCreateSheetOpen, setCreateSheetOpen] = useState(false);
  const [chapterCount, setChapterCount] = useState('5');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Fetch outlines
  const { data: outlines, isLoading: isLoadingOutlines } = useQuery({
    queryKey: ['generate-outlines', currentPage],
    queryFn: async () => {
      return await getOutlinesByUserId(currentPage, itemsPerPage);
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
          const result = await createOutline({
            title: outlinePrompt,
            chapters: data.outline.chapters
          });

          if (result.success) {
            toast.success('Outline generated and saved successfully!');
            setOutlinePrompt('');

            queryClient.invalidateQueries({
              queryKey: ['generate-outlines'],
            });
            setCreateSheetOpen(false);
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


  const onDeleteOutline = useMutation({
    mutationFn: async (id: string) => {
      return await deleteOutline({
        outline_id: id
      });
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(`Outline deleted successfully!`);
        queryClient.invalidateQueries({
          queryKey: ['generate-outlines'],
        });
      } else {
        toast.error(data.error || 'Failed to delete outline');
      }
    },
    onError: (error: unknown) => {
      console.error('Error deleting outline:', error);
      toast.error('An error occurred while deleting the outline');
    }
  })

  const handleDeleteOutline = (outline: BentoItem<Outline>) => {
    onDeleteOutline.mutate(outline.id);
  }

  const formatCardOutlines = (outlines: Outline[]): BentoItem<Outline>[] => {

    const formattedOutlines = outlines.map((outline): BentoItem<Outline> => {
      return {
        id: outline.id,
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

  const handleViewOutline = (selectedOutline: BentoItem<Outline>) => {
    const filteredOutline = outlines?.data?.find((outline) => outline.id === selectedOutline.id);
    setSelectedOutline(filteredOutline!);
    setIsSheetOpen(true);
  }


  return (
    <PageWrapper>
      <>
        <PageHeader
          titleText='Prompt Outlines'
          description='Create and manage AI image generation prompt outlines. Organize your ideas into structured chapters for consistent image series!'
          button_text={onGenerateAIOutline.isPending ? "Generating..." : "Generate Now"}
          onClick={() => setCreateSheetOpen(true)}
          icon={<SparklesIcon className="h-4 w-4" />}
        />
        <Sheet open={isCreateSheetOpen} onOpenChange={setCreateSheetOpen}>
          <SheetContent className='p-4'>
            <SheetTitle>Generate Outline</SheetTitle>
            <SheetDescription>
              Generate detailed book outlines and chapter structures with AI assistance.
            </SheetDescription>
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Be Simple. (e.g. Cute and Cozy Gardens)"
                value={outlinePrompt}
                className="w-full py-3 text-sm text-muted-foreground placeholder:text-muted-foreground bg-transparent rounded-md border border-muted-foreground/10 focus:border-primary focus-visible:ring-0 focus:ring-0 focus:outline-none "
                onChange={(e) => setOutlinePrompt(e.target.value)} />

              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add some keywords. (trees, flowers, nature)"
                    value={currentKeyword}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && currentKeyword.trim()) {
                        e.preventDefault();
                        setKeywords([...keywords, currentKeyword.trim()]);
                        setCurrentKeyword('');
                      }
                    }}
                    onChange={(e) => setCurrentKeyword(e.target.value)}
                  />
                </div>
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive/20"
                        onClick={() => setKeywords(keywords.filter((_, i) => i !== index))}
                      >
                        {keyword}
                        <span className="ml-1">×</span>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Select value={chapterCount} onValueChange={setChapterCount}>
                <SelectTrigger className='w-full focus-visible:ring-0 cursor-pointer'>
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
          </SheetContent>
        </Sheet>
      </>
      <div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formatCardOutlines(outlines.data).map(outline => {
                return (
                  <BentoCard
                    key={outline.id}
                    item={outline}
                    onView={() => handleViewOutline(outline)}
                    onDelete={() => handleDeleteOutline(outline)}
                  />
                )
              })}
              <OutlineSheet
                outline={selectedOutline}
                isOpen={isSheetOpen}
                onOpenChange={setIsSheetOpen}
              />
            </div>

            {outlines.total && outlines.total > itemsPerPage && (
              <div className="flex justify-center">
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
          />

        )}
      </div>
    </PageWrapper>

  );
}


