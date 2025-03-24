'use client';

import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { FolderIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type ProjectSheetProps = {
  children: React.ReactNode;
  onClick: () => void;
  isOpen: boolean;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  setTitleName: (name: string) => void;
  setKeywords: (keywords: string[]) => void;
  setCurrentKeyword: (keyword: string) => void;
  keywords: string[];
  currentKeyword: string;
  titleName: string;
  selectedColor?: string;
  setSelectedColor: (color: string) => void;
  isEditMode?: boolean;
};

export function ProjectSheet({ children, isLoading, isOpen, onOpenChange, titleName, setTitleName, setKeywords, keywords, setCurrentKeyword, currentKeyword, onClick, selectedColor = '#FFE5E5', setSelectedColor, isEditMode = false }: ProjectSheetProps) {
  const colors = [
    { name: 'Soft Pink', value: '#FFE5E5' },
    { name: 'Mint Green', value: '#E5FFE5' },
    { name: 'Baby Blue', value: '#E5E5FF' },
    { name: 'Lavender', value: '#F5E5FF' },
    { name: 'Peach', value: '#FFE5CC' },
    { name: 'Lemon', value: '#FFFFE5' },
    { name: 'Lilac', value: '#E5CCFF' },
    { name: 'Seafoam', value: '#E5FFF5' },
  ];

  const validTitleLength = 25
  const isValidTitle = titleName.length <= validTitleLength && titleName.length >= 5;
  const isValidKeywords = keywords.length >= 3;
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className='p-4'>
        <SheetTitle>{isEditMode ? 'Edit Project' : 'Create Project'}</SheetTitle>
        <SheetDescription>
          {isEditMode ? 'Edit your project details.' : 'Create a new project and start generating your book.'}
        </SheetDescription>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <textarea
              placeholder="Be Simple. (e.g. Mandalas, Animals, Space, etc...)"
              value={titleName}
              className={` w-full h-20 p-2 text-sm text-muted-foreground placeholder:text-muted-foreground bg-transparent rounded-md border ${!isValidTitle ? 'border-red-500' : 'border-muted-foreground/10'} focus:border-primary focus-visible:ring-0 focus:ring-0 focus:outline-none resize-none`}
              onChange={(e) => setTitleName(e.target.value)}
            />
            <div className="absolute bottom-5 right-2 flex justify-between text-xs text-muted-foreground">
              <span>{titleName.length}/{validTitleLength}</span>
            </div>
          </div>
          <div>
            <span className='text-xs text-muted-foreground'>Create Some keywords:</span>

            <div className="flex gap-2">
              <Input
                placeholder="Keywords to categorize your project"
                value={currentKeyword}
                className={`flex-1 placeholder:text-xs`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && currentKeyword.trim()) {
                    e.preventDefault();
                    setKeywords([...keywords, currentKeyword.trim()]);
                    setCurrentKeyword('');
                  }
                }}
                onChange={(e) => setCurrentKeyword(e.target.value)}
              />
            </div>
            <div className="text-xs text-muted-foreground py-2">
              <span>Press enter to create - at least {keywords.length}/3 </span>
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive/20"
                    onClick={() => setKeywords(keywords.filter((_, i) => i !== index))}
                  >
                    {keyword}
                    <span className="ml-1">×</span>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <span className='text-xs text-muted-foreground'>Select a color:</span>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  className={`h-8 rounded-md transition-all flex items-center justify-center ${selectedColor === color.value ? 'ring-2 ring-primary ring-offset-2' : 'hover:scale-105'}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setSelectedColor(color.value)}
                  title={color.name}
                >
                </button>
              ))}
            </div>
          </div>


          <Button
            disabled={isLoading || !isValidTitle || !isValidKeywords}
            onClick={onClick}
            variant="secondary"
            className="cursor-pointer hover:opacity-90 bg-gradient-to-r from-primary  to-primary/80 text-white">
            <FolderIcon className="mr-2 h-4 w-4" />
            {isLoading
              ? (isEditMode ? "Updating..." : "Creating...")
              : (isEditMode ? "Update Project" : "Create Now")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}