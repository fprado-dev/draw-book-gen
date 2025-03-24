'use client';

import { SparklesIcon } from 'lucide-react';
import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  renderIcon?: () => React.JSX.Element;
}

export function EmptyState({
  title,
  description,
  renderIcon
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-6 rounded-full bg-primary/10 p-4">
        {renderIcon ? renderIcon() : <SparklesIcon className="h-8 w-8 text-primary" />}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-primary">{title}</h3>
      <p className="mb-6 max-w-sm text-muted-foreground">{description}</p>
    </div>
  );
}