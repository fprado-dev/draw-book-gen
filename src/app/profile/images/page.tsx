'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SupabaseImage } from '@/components/ui/supabase-image';
import { Filter, Loader2, SparklesIcon, Download, Clipboard } from 'lucide-react';
import { supabase } from '@/services/supabase';
import * as AuthService from '@/services/auth.service';
import { TBook } from '@/types/ebook';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type ImageFile = {
  id: string;
  name: string;
  bookId: string;
  url: string;
  createdAt: string;
  bookTitle?: string;
};

export default function UserImagesPage() {
  const router = useRouter();
  const [selectedBookId, setSelectedBookId] = useState<string>('all');
  const [userImages, setUserImages] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all user's books
  const { data: books } = useQuery({
    queryKey: ['user-books'],
    queryFn: async () => {
      const { user } = await AuthService.getCurrentUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data as TBook[];
    },
  });

  console.log({ books })


  // Fetch all user's images
  useEffect(() => {
    const fetchUserImages = async () => {
      try {
        setIsLoading(true);
        const { user } = await AuthService.getCurrentUser();
        if (!user) {
          router.push('/sign-in');
          return;
        }

        // Get all books for the user
        const userBooks = books || [];

        // Create a map of book IDs to titles for quick lookup
        const bookTitleMap = userBooks.reduce((map, book) => {
          map[book.id] = book.title;
          return map;
        }, {} as Record<string, string>);

        // Fetch images for each book
        const allImages: ImageFile[] = [];

        // If a specific book is selected, only fetch images for that book
        if (selectedBookId !== 'all') {
          const bookImages = await fetchImagesForBook(selectedBookId, user.id, bookTitleMap[selectedBookId]);
          allImages.push(...bookImages);
        } else {
          // Fetch images for all books
          for (const book of userBooks) {
            const bookImages = await fetchImagesForBook(book.id, user.id, book.title);
            allImages.push(...bookImages);
          }
        }

        // Sort images by creation date (newest first)
        allImages.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        setUserImages(allImages);
      } catch (error) {
        console.error('Error fetching user images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (books) {
      fetchUserImages();
    }
  }, [books, selectedBookId, router]);

  const fetchImagesForBook = async (bookId: string, userId: string, bookTitle: string): Promise<ImageFile[]> => {
    try {
      const { data, error } = await supabase
        .storage
        .from('users-generated-images')
        .list(`${userId}/${bookId}`, {
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) throw error;

      // Get public URLs for each image
      const imageFiles = await Promise.all(
        (data || []).map(async (file) => {
          const { data: { publicUrl } } = supabase.storage
            .from('users-generated-images')
            .getPublicUrl(`${userId}/${bookId}/${file.name}`);
          console.log({ file })
          return {
            id: file.id,
            name: file.name,
            bookId: bookId,
            url: publicUrl,
            createdAt: file.created_at || new Date().toISOString(),
            bookTitle: bookTitle
          };
        })
      );

      return imageFiles;
    } catch (error) {
      console.error(`Error fetching images for book ${bookId}:`, error);
      return [];
    }
  };

  const handleBookFilterChange = (value: string) => {
    setSelectedBookId(value);
  };

  const handleDownloadImage = async (imageUrl: string, imageName: string) => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = imageName || 'generated-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded successfully');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    }
  };

  const handleCopyImageId = async (imageId: string) => {
    try {
      await navigator.clipboard.writeText(imageId);
      toast.success('Image ID copied to clipboard');
    } catch (error) {
      console.error('Error copying image ID:', error);
      toast.error('Failed to copy image ID');
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <Card className='border-0 shadow-none'>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl flex gap-2 justify-center items-center text-slate-600">
              <SparklesIcon />
              AI Generated Images</CardTitle>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={selectedBookId}
                onValueChange={handleBookFilterChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by book" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Books</SelectItem>
                  {books?.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading images...</span>
              </div>
            ) : userImages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No images found. Generate some images in your books!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {userImages.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <div className="aspect-square relative">
                      <SupabaseImage
                        src={image.url}
                        alt={`Generated image ${image.name}`}
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <CardFooter className="p-3 flex-col items-start">
                      <div className="flex justify-between items-center w-full">
                        {image.bookTitle && (
                          <p className="text-sm font-medium truncate w-full">
                            {image.bookTitle}
                          </p>
                        )}
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer"
                            onClick={() => handleCopyImageId(image.id)}
                            title="Copy image ID"
                          >
                            <Clipboard className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer"
                            onClick={() => handleDownloadImage(image.url, image.name)}
                            title="Download image"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}