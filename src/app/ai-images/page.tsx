'use client';

import { PageHeader } from '@/components/page-header';
import { PageWrapper } from '@/components/page-wrapper';
import { ImageGallery } from './components/image-gallery';

export default function UserImagesPage() {
  return (
    <PageWrapper>
      <PageHeader
        titleText="Your AI Art Collection"
        description="Explore your unique AI-generated artworks - each piece tells your creative story. Download, favorite, and build your personal masterpiece gallery."
      />
      <ImageGallery />
    </PageWrapper>
  );
}
