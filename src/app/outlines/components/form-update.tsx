import { mainQueryClient } from '@/components/providers';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateOutlineById } from '@/services/outlines.service';
import { TOutlines } from '@/types/outlines';
import { useQueryClient } from '@tanstack/react-query';

export function FormUpdateOutline({
  closeModal,
  outlineToUpdate,
}: {
  closeModal: () => void;
  outlineToUpdate: TOutlines;
}) {
  const queryClient = useQueryClient(mainQueryClient);

  const handleSubmit = (e: FormData) => {
    const title = e.get('title') as string;
    updateOutlineById({
      id: outlineToUpdate.id,
      title,
    });
    queryClient.invalidateQueries({ queryKey: ['outlines'] });
    closeModal();
  };

  return (
    <form className="space-y-4">
      <div>
        <Label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </Label>
        <div className="mt-1">
          <Input
            type="text"
            name="title"
            defaultValue={outlineToUpdate.title}
            className="text-xs placeholder:text-xs"
            id="title"
            placeholder="Book title"
            autoComplete="title"
            required
          />
        </div>
      </div>
      <div>
        <SubmitButton
          className="w-full"
          pendingText="Creating..."
          formAction={handleSubmit}
        >
          Update Outline
        </SubmitButton>
      </div>
    </form>
  );
}
