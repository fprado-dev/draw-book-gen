'use client';

import { SparklesIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
}

export function EmptyState({
  title,
  description,

}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-6 rounded-full bg-primary/10 p-4">
        <SparklesIcon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-primary">{title}</h3>
      <p className="mb-6 max-w-sm text-muted-foreground">{description}</p>
    </div>
  );
}