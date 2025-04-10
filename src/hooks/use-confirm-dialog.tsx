'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCallback, useState } from 'react';

interface ConfirmOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolve, setResolve] = useState<(value: boolean) => void>(() => { });

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    setOptions(options);
    setIsOpen(true);
    return new Promise((res) => {
      setResolve(() => res);
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    resolve(false);
  }, [resolve]);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    resolve(true);
  }, [resolve]);

  const ConfirmDialog = useCallback(
    ({ options }: { options: ConfirmOptions; }) => {
      return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{options.title}</DialogTitle>
              <DialogDescription>{options.description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                {options.cancelText || 'Cancel'}
              </Button>
              <Button variant="destructive" onClick={handleConfirm}>
                {options.confirmText || 'Confirm'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
    [isOpen, handleClose, handleConfirm]
  );

  return {
    confirm,
    ConfirmDialog,
  };
}