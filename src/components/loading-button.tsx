'use client';

import CreatingLoadingAnimation from '@/app/books/[bookId]/components/animation-loading';
import { Button } from '@/components/ui/button';
import { type ComponentProps } from 'react';
import { useFormStatus } from 'react-dom';

type Props = ComponentProps<typeof Button> & {};

export function LoadingButton({ children, ...props }: Props) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} aria-disabled={pending} {...props}>
      {pending ? <CreatingLoadingAnimation isCreating={pending} /> : children}
    </Button>
  );
}
