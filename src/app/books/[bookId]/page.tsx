'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookCheckIcon, BookTextIcon, CalendarIcon, Settings2Icon, XCircle } from 'lucide-react';
import GeneratePanel from '@/app/books/components/generate-panel';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { GeneratedImage, useBookImages } from '@/contexts/BookImagesContext';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '@/lib/date';
import { SupabaseImage } from '@/components/ui/supabase-image';
import * as BooksServices from "@/services/book.service"
import * as SupabaseStorage from "@/services/supabase-storage.service"
import { TBook } from '@/types/ebook';

interface SelectedImage {
  id: number;
  title: string;
  order: number;
}

type EboookParams = {
  bookId: string;
};
export default function EbookPage() {
  const params = useParams<EboookParams>();
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<GeneratedImage[]>([]);
  const { images, addImage, clearImages } = useBookImages();


  const { data: book, isLoading: loading } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      return await BooksServices.getBookById({
        id: params.bookId as string,
      })
    },
  });

  const { data: generatedImages, isLoading: isLoadingGeneratedImages } = useQuery({
    queryKey: ['book-images'],
    queryFn: async () => {
       const data = await SupabaseStorage.getGeneratedImagesByBookId({
        id: params.bookId
      })
      clearImages();

      for (const file of data || []) {
          const { publicUrl } = await SupabaseStorage
          .getPublicUrl(`/${params.bookId}/${file.name}`)
          // Add image to context
          addImage(params.bookId as string, publicUrl);
        }

        return data
    },
  })

  const handleImageSelect = (id: number) => {
    const selectedImage = images.find((image) => image.id === id);
    if (selectedImage) {
      setSelectedImages((prevSelectedImages) => {
        const imageIndex = prevSelectedImages.findIndex((img) => img.id === id);
        if (imageIndex !== -1) {
          // Remove image and reorder remaining images
          const newSelectedImages = [...prevSelectedImages];
          newSelectedImages.splice(imageIndex, 1);
          
          // Update order numbers for remaining images
          return newSelectedImages.map((img, index) => ({
            ...img,
            order: index + 1
          }));
        } else {
          // Add image with next order number
          return [
            ...prevSelectedImages.map(img => ({ ...img })),
            { ...selectedImage, order: prevSelectedImages.length + 1 }
          ];
        }
      });
    }
  };

  

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-32 bg-slate-200 rounded" />
          <Card>
            <CardHeader>
              <div className="h-6 w-24 bg-slate-200 rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-40 w-full bg-slate-200 rounded" />
                <div className="h-4 w-20 bg-slate-200 rounded" />
                <div className="h-4 w-32 bg-slate-200 rounded" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!book) {
    return null;
  }


  // Filter images by bookId
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

        {/* Book Cover Thumbnail */}
        <div className="w-full h-[100px] bg-slate-100 rounded-md overflow-hidden relative">
          {book.thumbnail_url ? (
            <Image
              src={book.thumbnail_url}
              alt={`${book.title} cover`}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100">
              <BookTextIcon className="h-12 w-12 text-slate-300" />
            </div>
          )}
        </div>
    
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{book.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Book Pages Size</p>
                  <p className="font-medium">{images?.length}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${book.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                    {book.status || 'Draft'}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Created At</p>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {formatDate(book.created_at)}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {formatDate(book.updated_at)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="cursor-pointer">
                Generate with AI
                <Settings2Icon className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[600px] sm:max-w-none">
              <SheetHeader className="py-4">
                <SheetTitle>Configuration</SheetTitle>
              </SheetHeader>
              <GeneratePanel bookId={book.id} />
            </SheetContent>
          </Sheet>
          <div className="flex gap-2">
            {selectedImages.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="cursor-pointer"
                onClick={() => setSelectedImages([])}
              >
                Clear Selection
                <XCircle className="h-4 w-4 ml-2" />
              </Button>
            )}
            <Sheet modal={true}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="cursor-pointer">
                  View PDF
                  <BookCheckIcon className="h-4 w-4 ml-2" />
                </Button>
              </SheetTrigger>
            <SheetContent side="right" className="w-full h-full p-0 sm:max-w-none bg-slate-50 overflow-y-auto">
              <div className="min-h-full w-full bg-slate-200 p-4">
                <div className="max-w-[800px] mx-auto space-y-8">
                  <SheetTitle className="text-center">PDF Preview</SheetTitle>
                  <div className="space-y-8">
                    {selectedImages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        Select images to preview them in PDF format
                      </div>
                    ) : (
                      // Sort images by their order before rendering
                      [...selectedImages]
                        .sort((a, b) => a.order - b.order)
                        .map((image) => {
                        return (
                        <div key={image.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                          <div className="p-4 border-b border-gray-200">
                            <p className="text-sm text-gray-600">Page {image.order}</p>
                          </div>
                          <div className="aspect-auto w-full bg-white p-8 flex items-center justify-center">
                            <div className="w-full h-full bg-slate-100 rounded-lg flex border-2 border-dashed border-slate-200">
                              <Image
                                src={image.url}
                                alt='Book page'
                                width={1200}
                                height={784}
                                className="object-contain"
                              />
                            </div>
                          </div>
                        </div>
                      )
                      })
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
            </Sheet>
        </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold py-5">AI Generated Images</h2>
          {isLoadingGeneratedImages ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : null}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {images.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <h3 className="mb-2 text-lg font-medium">No images yet</h3>
                <p className="mb-4 text-sm text-gray-500">
                  Generate your first image using the AI generator
                </p>
              </div>
            ) : (
              images.map((image) => (
                <div key={image.id} className="relative flex flex-col items-center gap-2">
                  <div
                    className="relative w-full cursor-pointer transition-all duration-200"
                    onClick={() => handleImageSelect(image.id)}
                  >
                  {selectedImages.some(img => img.id === image.id) && (
                    <div className='absolute top-4 right-4 w-8 h-8 rounded-full bg-primary border-2 border-white flex items-center justify-center text-white font-bold shadow-lg z-10'>
                      {selectedImages.findIndex(img => img.id === image.id) + 1}
                    </div>
                  )}

                    <div className={`w-full h-96 bg-slate-100 rounded-lg flex border-2 ${selectedImages.some(img => img.id === image.id) ? 'border-primary border-solid' : 'border-dashed border-slate-200'}`}>
                      <SupabaseImage
                        alt="Book page"
                        height={384}
                        width={600}
                        src={image.url}
                        className="object-contain"
                        fallbackText="Image failed to load"
                      />
                    </div>
                    {selectedImages.some(img => img.id === image.id) && (
                      <div className="absolute inset-0 bg-primary/10 rounded-lg pointer-events-none" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Image {image.id}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}