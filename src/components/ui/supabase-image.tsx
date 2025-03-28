'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type SupabaseImageProps = Omit<ImageProps, 'onError'> & {
  fallbackText?: string;
  fallbackClassName?: string;
};

export function SupabaseImage({
  alt,
  src,
  className,
  fallbackText,
  fallbackClassName,
  ...props
}: SupabaseImageProps) {
  const [error, setError] = useState(false);

  // If the image fails to load, show a fallback UI
  if (error) {
    return (
      <div
        className={cn(
          'bg-muted text-muted-foreground flex items-center justify-center rounded-md',
          className,
          fallbackClassName
        )}
        style={{ width: props.width, height: props.height }}
      >
        <span className="text-sm">{fallbackText || 'Image not available'}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
