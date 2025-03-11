'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookCheckIcon, CalendarIcon, Settings2Icon } from 'lucide-react';
import { Ebook } from '@/types/ebook';
import { supabase } from '@/services/supabase';
import { toast } from 'sonner';
import GeneratePanel from '@/app/books/components/generate-panel';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useBookImages } from '@/contexts/BookImagesContext';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '@/lib/date';
import { SupabaseImage } from '@/components/ui/supabase-image';
import { formatImageUrl } from '@/lib/image-utils';

interface SelectedImage {
  id: number;
  title: string;
  order: number;
}

export default function EbookPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const { images, addImage, clearImages } = useBookImages();


  const { data: session } = useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push('/sign-in');
        return null;
      }
      return session;
    },
  });

  const { data: ebook, isLoading: loading, error } = useQuery({
    queryKey: ['ebook', session?.user?.id, params.bookId],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data: ebook, error } = await supabase
        .from('ebooks')
        .select('*')
        .eq('id', params.bookId)
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Book not found');
        }
        throw new Error(error.message);
      }
      return ebook as Ebook;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (error) {
      toast.error('Failed to load ebook');
      router.push('/projects');
    }
  }, [error, router, params.projectId]);

  // Fetch images from Supabase storage using React Query
  const { isLoading: imagesLoading } = useQuery({
    queryKey: ['book-images', session?.user?.id, params.bookId],
    queryFn: async () => {
      if (!session?.user?.id || !params.bookId) return [];

      try {
        // Clear existing images in context
        clearImages();

        // List all files in the user's book directory
        const { data, error } = await supabase.storage
          .from('users-generated-images')
          .list(`${session.user.id}/${params.bookId}`, {
            sortBy: { column: 'created_at', order: 'desc' },
          });

        if (error) {
          console.error('Error fetching images:', error);
          throw error;
        }

        // Add each image to the BookImagesContext
        for (const file of data || []) {
          const { data: { publicUrl } } = supabase.storage
            .from('users-generated-images')
            .getPublicUrl(`${session.user.id}/${params.bookId}/${file.name}`);

          // Add image to context
          addImage(params.bookId as string, publicUrl);
        }

        return data || [];
      } catch (err) {
        console.error('Error fetching images from Supabase:', err);
        toast.error('Failed to load images');
        throw err;
      }
    },
    enabled: !!session?.user?.id && !!params.bookId,

  });

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

  const handleImageSelect = (index: number) => {
    setSelectedImages(prev => {
      const imageExists = prev.find(img => img.id === index);
      if (imageExists) {
        return prev.filter(img => img.id !== index);
      } else {
        const newImage: SelectedImage = {
          id: index,
          title: `Image ${index}`,
          order: prev.length + 1
        };
        return [...prev, newImage];
      }
    });
  };

  if (!ebook) {
    return null;
  }

  // Filter images by bookId
  const bookImages = images.filter(image => image.bookId === params.bookId);

  console.log('Book images:', bookImages)
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

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{ebook.title}</CardTitle>
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
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${ebook.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                    {ebook.status || 'Draft'}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Created At</p>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {formatDate(ebook.created_at)}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {formatDate(ebook.updated_at)}
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
              <GeneratePanel bookId={ebook.id} />
            </SheetContent>
          </Sheet>
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
                      images.map((image) => (
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
                      ))
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div>
          <h2 className="text-2xl font-bold py-5">AI Generated Images</h2>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {bookImages.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <h3 className="mb-2 text-lg font-medium">No images yet</h3>
                <p className="mb-4 text-sm text-gray-500">
                  Generate your first image using the AI generator
                </p>
              </div>
            ) : (
              bookImages.map((image) => (
                <div key={image.id} className="flex flex-col items-center gap-2">
                  <div
                    className="relative w-full cursor-pointer transition-all duration-200"
                    onClick={() => handleImageSelect(image.id)}
                  >
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