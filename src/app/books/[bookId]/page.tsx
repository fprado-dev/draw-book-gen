'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings2Icon, SparklesIcon } from 'lucide-react';
import GeneratePanel from '@/app/books/components/generate-panel';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useQuery } from '@tanstack/react-query';

import * as BooksServices from "@/services/book.service"
import * as ReplicateServices from "@/services/replicate.service"


type EboookParams = {
  bookId: string;
};
export default function EbookPage() {
  const params = useParams<EboookParams>();
  const router = useRouter();


  const { data: book, isLoading: isLoadingBookInfo } = useQuery({
    queryKey: ['books', params.bookId],
    queryFn: async () => {
      return await BooksServices.getBookById({
        id: params.bookId as string,
      })
    },
  });


  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="cursor-pointer w-fit hover:bg-slate-50 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Project
        </Button>

        {isLoadingBookInfo ? (
          <Card className="animate-pulse bg-slate-200 rounded" >
            <div className="h-6 w-24 bg-slate-200 rounded" />
          </Card>)
          :
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl truncate">{book?.title}</CardTitle>
            </CardHeader>
          </Card>
        }
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="cursor-pointer">
                  <span className='text-xs'>GENERATE WITH AI</span>
                  <SparklesIcon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[600px] sm:max-w-none">
                <SheetHeader className="py-4">
                  <SheetTitle>Configuration</SheetTitle>
                </SheetHeader>
                <GeneratePanel bookId={params.bookId} />
              </SheetContent>
            </Sheet>
          </div>

        </div>
        <div>
          <h2 className="text-2xl font-bold py-5">AI Generated Images</h2>
          {true ? (
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="animate-pulse">
                  <div className="w-full h-96 bg-slate-200 rounded-lg"></div>
                  <div className="mt-2 h-4 w-20 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <h1>Images</h1>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}