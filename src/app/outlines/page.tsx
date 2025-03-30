'use client';

import { useState } from 'react';
import { SparklesIcon } from 'lucide-react';

import { PageHeader } from '@/components/page-header';
import { PageWrapper } from '@/components/page-wrapper';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';

import { OutlinesList } from './components/outlines-list';
import { FormCreateOutline } from './components/form-create';

export default function OutlinesPage() {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <PageWrapper>
      <PageHeader
        titleText="Prompt Outlines"
        description="Create and manage AI image generation prompt outlines. Organize your ideas into structured chapters for consistent image series!"
        button_text={false ? 'Generating...' : 'Generate Now'}
        onClick={() => setIsCreating(true)}
        icon={<SparklesIcon className="h-4 w-4" />}
      />
      <Sheet onOpenChange={setIsCreating} open={isCreating}>
        <SheetContent className="px-4 py-4">
          <SheetTitle>Create New Outline</SheetTitle>
          <SheetDescription>
            Create a new outline by entering a title. The title will help you
            identify and organize your image generation.
          </SheetDescription>
          <FormCreateOutline closeModal={() => setIsCreating(false)} />
        </SheetContent>
      </Sheet>
      <OutlinesList />
    </PageWrapper>
  );
}
