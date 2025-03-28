'use client';

import { PageHeader } from '@/components/page-header';
import { PageWrapper } from '@/components/page-wrapper';
import { getBookById } from '@/services/book.service';
import { useQuery } from '@tanstack/react-query';
import { FilePlus } from 'lucide-react';
import { useParams } from 'next/navigation';

type EboookParams = {
  bookId: string;
};
export default function EbookPage() {
  const params = useParams<EboookParams>();

  const { data, isLoading } = useQuery({
    queryKey: ['book-id', params.bookId],
    queryFn: () => getBookById(params.bookId),
    enabled: true,
  });

  return (
    <PageWrapper>
      <PageHeader
        titleText="Book Pages"
        description="View and manage all pages in this book. You can create new pages, update existing ones, or remove pages as needed."
        button_text="Create Page"
        icon={<FilePlus className="h-4 w-4" />}
      />
    </PageWrapper>
  );
}
