import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { onCreateBook } from "@/services/book.service";
import { TBookStatus } from "@/types/ebook";
import { Archive, BookDashed, BookOpenCheck } from "lucide-react";
import { useState } from "react";


type TFormCreateBook = {
  closeModal: () => void
}

export function FormCreateBook({ closeModal }: TFormCreateBook) {
  const [status, setStatus] = useState("draft");


  const handleSubmit = (e: FormData) => {
    onCreateBook(e, status as TBookStatus);
    closeModal()
  }
  return (
    <form className="space-y-4" >
      <div>
        <Label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </Label>
        <div className="mt-1">
          <Input
            type="text"
            name="title"
            id="title"
            placeholder="Book title"
            autoComplete="title"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="size" className="block text-sm font-medium text-gray-700">
          Size
        </Label>
        <div className="mt-1">
          <Select name="size" defaultValue="6x9">
            <SelectTrigger>
              <SelectValue placeholder="Select a size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5x8">5"x8"</SelectItem>
              <SelectItem value="5.25x8">5.25" x 8"</SelectItem>
              <SelectItem value="5.5x8.5">5.5" x 8.5"</SelectItem>
              <SelectItem value="6x9">6" x 9"</SelectItem>
              <SelectItem value="7x10">7" x 10"</SelectItem>
              <SelectItem value="8x10">8" x 10"</SelectItem>
              <SelectItem value="8.5x11">8.5" x 11"</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Status
        </Label>
        <div className="mt-1 flex gap-2">
          <ToggleGroup onValueChange={setStatus} defaultValue={status} defaultChecked type="single" className="flex w-full " >
            <ToggleGroupItem className="border border-slate-100 flex gap-2" value="draft" aria-label="Toggle draft">
              <BookDashed className="h-4 w-4" />
              Draft

            </ToggleGroupItem>
            <ToggleGroupItem className="border border-slate-100 flex gap-2" value="published" aria-label="Toggle published">
              <BookOpenCheck className="h-4 w-4" />
              Published

            </ToggleGroupItem>
            <ToggleGroupItem className="border border-slate-100 flex gap-2" value="archived" aria-label="Toggle Archived">
              <Archive className="h-4 w-4" />
              Archived
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div>
        <SubmitButton className="w-full" pendingText="Creating..." formAction={handleSubmit}>
          Create
        </SubmitButton>
      </div>
    </form>
  )
}