'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { EbookList } from './components/ebook-list'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TBookSize } from '@/types/ebook'
import * as BooksServices from "@/services/book.service"


export default function ProjectDetailsPage() {
  const params = useParams()
  const queryClient = useQueryClient()
  const [showNewBookSheet, setShowNewBookSheet] = useState(false)
  const [newBookTitle, setNewBookTitle] = useState('')
  const [newBookSize, setNewBookSize] = useState('')
  const [newBookStatus] = useState<'draft' | 'published' | 'archived'>('draft')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all')


  const { data: books = [], isLoading: isLoadingBooks } = useQuery({
    queryKey: ['books', params.id],
    queryFn: async () => {
      const books = await BooksServices.getProjectBooks({
        id: params.id as string,
      });
      return books;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  const createBookMutation = useMutation({
    mutationFn: async () => {
      const newBook = await BooksServices.createBook({
        title: newBookTitle,
        size: newBookSize as TBookSize,
        status: newBookStatus as 'draft' | 'published' | 'archived',
        project_id: params.id as string,
      })
      return newBook
    },
    onSuccess: (book) => {
      toast.success(`Book created successfully ${book.title}`)
      setShowNewBookSheet(false)
      queryClient.invalidateQueries({ queryKey: ['books'] })
    },
    onError: () => {
      toast.error('Something went wrong while creating book')
    },
  })

  const handleCreateBook = async () => {
    if (!newBookTitle || !newBookSize) {
      toast.error('Please fill in all fields')
      return
    }
    createBookMutation.mutate()
  }



  return (
    <div className='px-4 flex flex-col gap-4' >
      <div className="flex justify-end items-center gap-2">
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | 'draft' | 'published' | 'archived')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Sheet open={showNewBookSheet} onOpenChange={setShowNewBookSheet}>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Book
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create New Book</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newBookTitle}
                  onChange={(e) => setNewBookTitle(e.target.value)}
                  placeholder="Enter book title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="size">Book Size</Label>
                <Select value={newBookSize} onValueChange={setNewBookSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select book size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5x8">{`5" x 8" (12.7 x 20.32 cm)`}</SelectItem>
                    <SelectItem value="5.25x8">{`5.25" x 8" (13.34 x 20.32 cm)`}</SelectItem>
                    <SelectItem value="5.5x8.5">{`5.5" x 8.5" (13.97 x 21.59 cm)`}</SelectItem>
                    <SelectItem value="6x9">{`6" x 9" (15.24 x 22.86 cm)`}</SelectItem>
                    <SelectItem value="7x10">{`7" x 10" (17.78 x 25.4 cm)`}</SelectItem>
                    <SelectItem value="8x10">{`8" x 10" (20.32 x 25.4 cm)`}</SelectItem>
                    <SelectItem value="8.5x11">{`8.5" x 11" (21.59 x 27.94 cm)`}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleCreateBook}
                disabled={createBookMutation.isPending}
                className="mt-4"
              >
                {createBookMutation.isPending ? 'Creating...' : 'Create Book'}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="mt-4">
        <EbookList
          books={statusFilter === 'all' ? books : books.filter(book => book.status === statusFilter)}
          isLoading={isLoadingBooks}
        />
      </div>
    </div>
  )
}