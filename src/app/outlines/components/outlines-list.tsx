import { mainQueryClient } from '@/components/providers';
import { BentoCard } from '@/components/ui/bento-card';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';
import { useSidebar } from '@/components/ui/sidebar';
import { deleteOutline, getAllOutlines } from '@/services/outlines.service';
import { TOutlines } from '@/types/outlines';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { formatOutlineCard } from '../utils/format-card';
import { AlertDialogConfirmation } from './alert-dialog-confirmation';
import { FormUpdateOutline } from './form-update';
import { SkeletonOutline } from './skeleton-outline';
import { ViewPromptSheet } from './view-prompt-sheet';

export function OutlinesList() {
  const { open } = useSidebar();
  const queryClient = useQueryClient(mainQueryClient);
  const [outlineToDelete, setOutlineToDelete] = useState<TOutlines>();
  const [isOpenDialogDelete, setDialogDelete] = useState(false);
  const [outlineToUpdate, setOutlineToUpdate] = useState<TOutlines>();
  const [isOpenUpdateSheet, setUpdateSheet] = useState(false);
  const [isPromptsOpen, setIsPromptsOpen] = useState(false);
  const [promptByOutlineId, setPromptByOutlineId] = useState<TOutlines>();

  const { data: outlines, isLoading: isLoadingOutlines } = useQuery({
    queryKey: ['outlines'],
    queryFn: getAllOutlines,
  });

  const deleteOutlineMutation = useMutation({
    mutationFn: deleteOutline,
    mutationKey: ['delete-outline'],
    onSuccess: () => {
      setDialogDelete(false);
      queryClient.invalidateQueries({ queryKey: ['outlines'] });
      toast.success(`Outline ${outlineToDelete?.title} deleted successfully`);
    },
  });
  const onConfirmDelete = async () => {
    deleteOutlineMutation.mutate({ outline_id: outlineToDelete?.id! });
  };

  const handleDeleteOutline = async (id: string) => {
    setOutlineToDelete(outlines?.data?.find((outline) => outline.id === id)!);
    setDialogDelete(true);
  };

  const handleUpdateOutline = async (outlineId: string) => {
    setOutlineToUpdate(
      outlines?.data?.find((outline) => outline.id === outlineId)
    );
    setUpdateSheet(true);
  };

  const handleViewOutline = (id: string) => {
    setIsPromptsOpen((prev) => !prev);
    setPromptByOutlineId(outlines?.data?.find((outline) => outline.id === id)!);
  };

  return (
    <>
      {promptByOutlineId && (
        <ViewPromptSheet
          isOpen={isPromptsOpen}
          onOpenChange={setIsPromptsOpen}
          promptByOutlineId={promptByOutlineId!}
        />
      )}

      <AlertDialogConfirmation
        title={outlineToDelete?.title!}
        isOpen={isOpenDialogDelete}
        onOpenChange={setDialogDelete}
        onConfirm={onConfirmDelete}
      />
      <Sheet onOpenChange={setUpdateSheet} open={isOpenUpdateSheet}>
        <SheetContent className="px-4 py-4">
          <SheetTitle>Update Outline</SheetTitle>
          <SheetDescription>
            Make changes to your Outline details below. The title serves as the
            main identifier for your outline, so ensure it remains clear and
            memorable.
          </SheetDescription>
          <FormUpdateOutline
            outlineToUpdate={outlineToUpdate!}
            closeModal={() => setUpdateSheet(false)}
          />
        </SheetContent>
      </Sheet>
      {isLoadingOutlines && <SkeletonOutline />}
      <div
        className={`grid gap-4  @max-xl:grid-cols-1 @min-xl:@max-3xl:grid-cols-2 @min-3xl:@max-7xl:grid-cols-3 grid-cols-4`}
      >
        {outlines?.data &&
          outlines?.data.length > 0 &&
          formatOutlineCard(outlines?.data).map((outline) => (
            <BentoCard
              key={outline.id}
              item={outline}
              onDelete={handleDeleteOutline}
              onEdit={handleUpdateOutline}
              onView={handleViewOutline}
            />
          ))}
      </div>
      {outlines?.data && outlines?.data.length === 0 && (
        <EmptyState
          title="No Outlines found"
          description="Create your first outline to get started."
        />
      )}
    </>
  );
}
