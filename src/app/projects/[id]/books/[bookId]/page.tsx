'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookCheckIcon, BookTextIcon, CalendarIcon, Eye, EyeOff } from 'lucide-react';
import { Ebook } from '@/types/ebook';
import { getEbook } from '@/services/ebook';
import { getAuth } from 'firebase/auth';
import { app } from '@/services/firebase';
import { toast } from 'sonner';
import GeneratePanel from '../../components/generate-panel';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface SelectedImage {
  id: number;
  title: string;
  order: number;
}

export default function EbookPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const user = getAuth(app).currentUser;

  useEffect(() => {
    const fetchEbook = async () => {
      if (!user) {
        router.push('/sign-in');
        return;
      }

      try {
        const { ebook: ebookData, error } = await getEbook(
          user.uid,
          params.id as string,
          params.bookId as string
        );

        if (error) {
          toast.error(error);
          router.push(`/projects/${params.id}`);
          return;
        }

        if (ebookData) {
          setEbook(ebookData);
        }
      } catch (error) {
        console.error('Error fetching ebook:', error);
        toast.error('Failed to load ebook');
        router.push(`/projects/${params.id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEbook();
  }, [user, params.id, params.bookId, router]);

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
                  <p className="text-sm text-gray-500">Book Size</p>
                  <p className="font-medium">{ebook.size}</p>
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
                    {new Date(ebook.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {new Date(ebook.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2"
          >
            {showPreview ? (
              <>
                <EyeOff className="h-4 w-4" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Show Generate Panel
              </>
            )}
          </Button>
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
                      selectedImages.map((image) => (
                        <div key={image.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                          <div className="p-4 border-b border-gray-200">
                            <p className="text-sm text-gray-600">Page {image.order}</p>
                          </div>
                          <div className="aspect-[1/1.4142] w-full bg-white p-8 flex items-center justify-center">
                            <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-200">
                              <BookTextIcon className="w-16 h-16 text-slate-400" />
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
        {showPreview && <GeneratePanel />}
        <div>
          <h2 className="text-2xl font-bold py-5">AI Generated Images</h2>

          <div className="grid md:grid-cols-5 gap-4 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="relative w-full">
                  <input
                    type="checkbox"
                    checked={selectedImages.some(img => img.id === index)}
                    onChange={() => handleImageSelect(index)}
                    className="absolute top-2 left-2 w-4 h-4 cursor-pointer z-10"
                  />
                  <div className="w-full h-56 bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-200">
                    <BookTextIcon className="w-12 h-12 text-slate-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">Image {index}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}