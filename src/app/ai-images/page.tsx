'use client';

import { useState, useEffect, ForwardRefExoticComponent, RefAttributes } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SupabaseImage } from '@/components/ui/supabase-image';
import { Filter, Download, Clipboard, Zap, Calendar, Image as ImageIcon, LucideProps } from 'lucide-react';
import { supabase } from '@/services/supabase';
import * as AuthService from '@/services/auth.service';
import { TBook } from '@/types/ebook';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
type ImageFile = {
  id: string;
  name: string;
  bookId: string;
  url: string;
  createdAt: string;
  bookTitle?: string;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function UserImagesPage() {
  const router = useRouter();
  const [selectedBookId, setSelectedBookId] = useState<string>('all');
  const [userImages, setUserImages] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalImages: 0,
    thisMonth: 0,
    averagePerBook: 0
  });

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

        // Calculate statistics
        const now = new Date();
        const thisMonth = allImages.filter(img => {
          const imgDate = new Date(img.createdAt);
          return imgDate.getMonth() === now.getMonth() && imgDate.getFullYear() === now.getFullYear();
        }).length;

        setStats({
          totalImages: allImages.length,
          thisMonth,
          averagePerBook: userBooks.length ? Math.round(allImages.length / userBooks.length) : 0
        });
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

  const StatCard = ({ icon: Icon, label, value }: { icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>; label: string; value: number | string }) => (
    <Card className="bg-white/50 backdrop-blur-sm border border-slate-200">
      <CardContent className="flex items-center p-6">
        <div className="rounded-full p-2 bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="py-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <StatCard
          icon={ImageIcon}
          label="Total Images"
          value={stats.totalImages}
        />
        <StatCard
          icon={Calendar}
          label="Generated This Month"
          value={stats.thisMonth}
        />
        <StatCard
          icon={Zap}
          label="Average per Book"
          value={stats.averagePerBook}
        />
      </motion.div>

      <Card className='border-0 shadow-none'>
        <CardHeader className="flex flex-row items-center justify-between p-0">
          <div className="flex items-center">
            <Select
              value={selectedBookId}
              onValueChange={handleBookFilterChange}
            >
              <SelectTrigger className="w-[280px]">
                <Filter className="h-4 w-4 text-muted-foreground" />
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
        <CardContent className='p-0'>
          {isLoading ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {[...Array(8)].map((_, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', damping: 20 }}
                >
                  <Card className="group overflow-hidden bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-colors duration-300">
                    <div className="aspect-square relative overflow-hidden bg-slate-100 animate-pulse" />
                    <CardFooter className="p-4 flex-col items-start space-y-2">
                      <div className="flex justify-between items-center w-full">
                        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                        <div className="flex gap-1">
                          <div className="h-8 w-8 bg-slate-200 rounded animate-pulse" />
                          <div className="h-8 w-8 bg-slate-200 rounded animate-pulse" />
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : userImages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No images found. Generate some images in your books!</p>
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {userImages.map((image) => (
                  <motion.div
                    key={image.id}
                    variants={item}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', damping: 20 }}
                  >
                    <Card className="group overflow-hidden bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-colors duration-300">
                      <div className="aspect-square relative overflow-hidden">
                        <SupabaseImage
                          src={image.url}
                          alt={`Generated image ${image.name}`}
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <CardFooter className="p-4 flex-col items-start space-y-2">
                        <div className="flex justify-between items-center w-full">
                          {image.bookTitle && (
                            <p className="text-sm font-medium truncate w-full text-slate-600">
                              {image.bookTitle}
                            </p>
                          )}
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(image.createdAt), 'MMM d, yyyy')}
                          </p>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 cursor-pointer hover:bg-slate-100"
                              onClick={() => handleCopyImageId(image.id)}
                              title="Copy image ID"
                            >
                              <Clipboard className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 cursor-pointer hover:bg-slate-100"
                              onClick={() => handleDownloadImage(image.url, image.name)}
                              title="Download image"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}