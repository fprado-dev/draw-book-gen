import { mainQueryClient } from '@/components/providers';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { createOutline } from '@/services/outlines.service';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const quantities = [
  {
    label: '5',
    value: '5',
  },
  {
    label: '10',
    value: '10',
  },
  {
    label: '20',
    value: '20',
  },
];
export function FormCreateOutline({ closeModal }: { closeModal: () => void }) {
  const [outlineQuantity, setOutlineQuantity] = useState('5');
  const queryClient = useQueryClient(mainQueryClient);

  const handleSubmit = (e: FormData) => {
    const title = e.get('title') as string;
    createOutline({
      title,
      outlineQuantity,
    });
    queryClient.invalidateQueries({ queryKey: ['outlines'] });
    closeModal();
  };

  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="title" className="block text-sm font-medium">
          Title
        </Label>
        <div className="mt-1">
          <Input
            type="text"
            name="title"
            className="text-xs placeholder:text-xs"
            id="title"
            placeholder="Book title"
            autoComplete="title"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="size" className="block text-sm font-medium ">
          Number of Prompts
        </Label>
        <div className="mt-1 flex gap-2">
          <ToggleGroup
            onValueChange={setOutlineQuantity}
            defaultValue={outlineQuantity}
            defaultChecked
            type="single"
            className="flex w-full "
          >
            {quantities.map((number) => (
              <ToggleGroupItem
                key={number.value}
                className="flex gap-2 border text-xs"
                value={number.value}
                aria-label={`Toggle ${number.label}`}
              >
                {number.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
      <div>
        <SubmitButton
          className="w-full"
          pendingText="Creating..."
          formAction={handleSubmit}
        >
          Create Outline
        </SubmitButton>
      </div>
    </form>
  );
}
