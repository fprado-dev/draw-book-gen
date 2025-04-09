import CreatingLoadingAnimation from '@/app/books/[bookId]/components/animation-loading';
import { mainQueryClient } from '@/components/providers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { createOutline } from '@/services/outlines.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

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
export function FormCreateOutline({ closeModal }: { closeModal: () => void; }) {
  const [outlineQuantity, setOutlineQuantity] = useState('5');
  const [outline, setOutlinePrompt] = useState('');
  const queryClient = useQueryClient(mainQueryClient);

  const outlineMutation = useMutation({
    mutationFn: createOutline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outlines'] });
      closeModal();
    },
    onError: () => {
      toast.error('Failed to generate image. Please try again.');
    },
  });
  const handleSubmit = () => {
    outlineMutation.mutate({ title: outline, outlineQuantity });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="outline" className="block text-sm font-medium">
          Outline
        </Label>
        <div className="mt-1">
          <Input
            type="text"
            name="outline"
            className="text-xs placeholder:text-xs"
            id="outline"
            onChange={(e) => setOutlinePrompt(e.target.value)}
            placeholder="Book Outline"
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
        <Button
          className="w-full"
          disabled={!prompt || outlineMutation.isPending}
          onClick={handleSubmit}>
          {outlineMutation.isPending ? (<CreatingLoadingAnimation isCreating={outlineMutation.isPending} />) : "Generate Outlines"}
        </Button>
      </div>
    </div>
  );
}
