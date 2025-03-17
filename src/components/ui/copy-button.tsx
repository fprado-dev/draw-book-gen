'use client';

import * as React from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './button';

interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  className?: string;
}

export function CopyButton({ value, className, ...props }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (hasCopied) {
      const timeout = setTimeout(() => setHasCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [hasCopied]);

  return (
    <Button
      size="icon"
      variant="ghost"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setHasCopied(true);
          toast.success('Copied to clipboard');
        } catch (error) {
          console.error('Failed to copy:', error);
          toast.error('Failed to copy to clipboard');
        }
      }}
      {...props}
    >
      {hasCopied ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}