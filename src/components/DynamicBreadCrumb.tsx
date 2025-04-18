'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { TBook } from '@/types/ebook';
import { House } from 'lucide-react';

import { usePathname } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';

const routeLabels: Record<string, string> = {
  outlines: 'Outlines',
  'ai-images': 'AI Images',
  books: 'Books',
};

const DynamicBreadCrumb = () => {
  const pathname = usePathname();
  const [currentBook, setCurrentBook] = useState<TBook | null>(null);

  useEffect(() => {
    try {
      const bookData = localStorage.getItem('aillustra-current-book');
      setCurrentBook(bookData ? JSON.parse(bookData) : null);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, [pathname]);

  type TPathSegments = {
    label: string;
    href: string;
    isLast: boolean;
  };

  const getPathSegments = (): TPathSegments[] => {
    if (pathname.startsWith('/books/')) {
      const segments = pathname.split('/');

      if (segments.length === 3) {
        // URL pattern: /books/{bookId}
        return [
          {
            label: 'Books',
            href: '/books',
            isLast: false,
          },
          {
            label: currentBook?.title || 'Book',
            href: pathname,
            isLast: true,
          },
        ];
      }
    }

    return [
      {
        label: routeLabels[pathname.split('/')[1]] || 'Dashboard',
        href: '/',
        isLast: true,
      },
    ];
  };

  const segments = getPathSegments();

  if (segments.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <House className="text-foreground h-4 w-4" />{' '}
        <span className="text-foreground text-xs">/</span>
        {segments.map((segment, index) => (
          <Fragment key={index}>
            <BreadcrumbItem key={segment.href}>
              {segment.isLast ? (
                <BreadcrumbPage>{segment.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={segment.href}>
                  {segment.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!segment.isLast && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadCrumb;
