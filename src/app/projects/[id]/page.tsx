'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarIcon, Clock, Palette, ArrowLeft, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getProjectBooks } from '@/services/book.service'
import { toast } from 'sonner'
import { EbookList } from './components/ebook-list'
import { formatDate } from '@/lib/date'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as AuthService from "@/services/auth.service"
import * as ProjectsService from "@/services/projects.service"
import * as BooksServices from "@/services/book.service"
import { TBook, TBookSize } from '@/types/ebook'


export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [showNewBookSheet, setShowNewBookSheet] = useState(false)
  const [newBookTitle, setNewBookTitle] = useState('')
  const [newBookSize, setNewBookSize] = useState('')
  const [newBookStatus] = useState<'draft' | 'published' | 'archived'>('draft')



  const { data: project, isLoading: isLoadingProjectInfo } = useQuery({
    queryKey: ['project'],
    queryFn: async () => {
      const project = await ProjectsService.getProjectById({ id: params.id as string })

      return project
    },

  })

  const { data: books = [], isLoading: isLoadingEbooks } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {

      const books = await getProjectBooks({
        id: params.id as string,

      });
      return books;
    },
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
    onError: (error) => {
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

  if (isLoadingProjectInfo) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-6 mb-8">
          <div className="h-10 w-32 bg-slate-200 rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className='flex flex-row items-center justify-between animate-pulse'>
                <CardHeader>
                  <div className="h-6 w-24 bg-slate-200 rounded" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 w-20 bg-slate-200 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="h-24 rounded-lg bg-slate-200 animate-pulse" />
        </div>
      </div>
    )
  }


  if (!project) {
    toast.error('Project not found')
    router.push('/projects')
    return null
  }

  return (
    <div className="container mx-auto py-6 ">
      <div className="flex flex-col gap-6 mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="cursor-pointer w-fit hover:bg-slate-50 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className='flex flex-row items-center justify-between'>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4" />
                Created
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {formatDate(project.created_at)}
              </p>
            </CardContent>
          </Card>

          <Card className='flex flex-row items-center justify-between'>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                Updated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {formatDate(project!.updated_at)}
              </p>
            </CardContent>
          </Card>

          <Card className='flex flex-row items-center justify-between'>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Palette className="h-4 w-4" />
                Theme
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: project!.color }}
              />
              <p className="text-sm">{project!.color.toUpperCase()}</p>
            </CardContent>
          </Card>
        </div>
        <div
          className="h-24 rounded-lg relative"
          style={{ backgroundColor: project!.color }}
        >
          <div className="absolute bottom-4 left-4">
            <h1 className="text-4xl font-bold text-white">{project!.title}</h1>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center mb-4">
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
                    <SelectItem value="5x8">5" x 8" (12.7 x 20.32 cm)</SelectItem>
                    <SelectItem value="5.25x8">5.25" x 8" (13.34 x 20.32 cm)</SelectItem>
                    <SelectItem value="5.5x8.5">5.5" x 8.5" (13.97 x 21.59 cm)</SelectItem>
                    <SelectItem value="6x9">6" x 9" (15.24 x 22.86 cm)</SelectItem>
                    <SelectItem value="7x10">7" x 10" (17.78 x 25.4 cm)</SelectItem>
                    <SelectItem value="8x10">8" x 10" (20.32 x 25.4 cm)</SelectItem>
                    <SelectItem value="8.5x11">8.5" x 11" (21.59 x 27.94 cm)</SelectItem>
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

      <div className="mt-8">
        <EbookList books={books} isLoading={false} />
      </div>
    </div>
  )
}