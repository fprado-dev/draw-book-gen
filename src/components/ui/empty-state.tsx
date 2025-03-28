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
  renderIcon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-primary/10 mb-6 rounded-full p-4">
        {renderIcon ? (
          renderIcon()
        ) : (
          <SparklesIcon className="text-primary h-8 w-8" />
        )}
      </div>
      <h3 className="text-primary mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
    </div>
  );
}
