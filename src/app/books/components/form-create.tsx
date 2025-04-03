import { mainQueryClient } from '@/components/providers';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { onCreateBook } from '@/services/book.service';
import {
  TBookMeasurementUnit,
  TBookPaperColor,
  TBookSize,
  TBookStatus,
  TBookType,
} from '@/types/ebook';
import { useQueryClient } from '@tanstack/react-query';
import { Archive, BookDashed, BookOpenCheck } from 'lucide-react';
import { useState } from 'react';

type TFormCreateBook = {
  closeModal: () => void;
};

const bookTypes: TBookType[] = ['paperback', 'hardcover'];

const bookMeasurementUnits: TBookMeasurementUnit[] = ['inches', 'millimeters'];

const bookPaperColor: TBookPaperColor[] = ['white', 'cream'];

const bookSizes: TBookSize[] = [
  '5x8',
  '5.25x8',
  '5.5x8.5',
  '6x9',
  '5.06x7.81',
  '6.14x9.21',
  '6.69x9.61',
  '7x10',
  '7.44x9.69',
  '7.5x9.25',
  '8x10',
  '8.5x11',
  '8.27x11.69',
  '8.25x6',
  '8.25x8.25',
  '8.5x8.5',
];

const bookStatus: TBookStatus[] = ['draft', 'published', 'archived'];

export function FormCreateBook({ closeModal }: TFormCreateBook) {
  const [status, setStatus] = useState('draft');
  const [paperColor, setBookPaperColor] = useState('white');
  const [bookType, setBookType] = useState('paperback');
  const [unit, setMeasurementUnit] = useState('inches');

  const queryClient = useQueryClient(mainQueryClient);

  const handleSubmit = (e: FormData) => {
    onCreateBook(
      e,
      status as TBookStatus,
      paperColor as TBookPaperColor,
      bookType as TBookType,
      unit as TBookMeasurementUnit
    );
    queryClient.invalidateQueries({ queryKey: ['books'] });
    closeModal();
  };
  return (
    <form className="space-y-4">
      <div>
        <Label
          htmlFor="title"
          className="block text-sm font-medium"
        >
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
        <Label
          htmlFor="size"
          className="block text-sm font-medium"
        >
          Size
        </Label>
        <div className="mt-1">
          <Select name="size" defaultValue="6x9">
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="Select a size" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              {bookSizes.map((size) => (
                <SelectItem className="text-xs" key={size} value={size}>
                  {size} inches
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label className="block text-sm font-medium ">
          Book Type
        </Label>
        <div className="mt-1 flex gap-2">
          <ToggleGroup
            onValueChange={setBookType}
            defaultValue={bookType}
            defaultChecked
            type="single"
            className="flex w-full "
          >
            {bookTypes.map((type) => (
              <ToggleGroupItem
                key={type}
                className="flex gap-2 border text-xs"
                value={type}
                aria-label={`Toggle ${type}`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
      <div>
        <Label className="block text-sm font-medium ">
          Paper Color
        </Label>
        <div className="mt-1 flex gap-2">
          <ToggleGroup
            onValueChange={setBookPaperColor}
            defaultValue={paperColor}
            defaultChecked
            type="single"
            className="flex w-full "
          >
            {bookPaperColor.map((color) => (
              <ToggleGroupItem
                key={color}
                className="flex gap-2 border text-xs"
                value={color}
                aria-label={`Toggle ${color}`}
              >
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
      <div>
        <Label className="block text-sm font-medium ">
          Measurement Units
        </Label>
        <div className="mt-1 flex gap-2">
          <ToggleGroup
            onValueChange={setMeasurementUnit}
            defaultValue={unit}
            defaultChecked
            type="single"
            className="flex w-full "
          >
            {bookMeasurementUnits.map((unit) => (
              <ToggleGroupItem
                key={unit}
                className="flex gap-2 border text-xs"
                value={unit}
                aria-label={`Toggle ${unit}`}
              >
                {unit.charAt(0).toUpperCase() + unit.slice(1)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
      <div>
        <Label className="block text-sm font-medium ">
          Status
        </Label>
        <div className="mt-1 flex gap-2">
          <ToggleGroup
            onValueChange={setStatus}
            defaultValue={status}
            defaultChecked
            type="single"
            className="flex w-full "
          >
            {bookStatus.map((status) => (
              <ToggleGroupItem
                key={status}
                className="flex gap-2 border text-xs"
                value={status}
                aria-label={`Toggle ${status}`}
              >
                {status === 'draft' && <BookDashed className="h-2 w-2" />}
                {status === 'published' && (
                  <BookOpenCheck className="h-2 w-2" />
                )}
                {status === 'archived' && <Archive className="h-2 w-2" />}
                {status.charAt(0).toUpperCase() + status.slice(1)}
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
          Create
        </SubmitButton>
      </div>
    </form>
  );
}
