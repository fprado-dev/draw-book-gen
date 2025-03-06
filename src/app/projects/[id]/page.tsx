'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Project } from '@/types/project'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarIcon, Clock, Palette, ArrowLeft, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import GeneratePanel from './components/generate-panel'
import { getAuth } from 'firebase/auth'
import { getDatabase, ref, get } from 'firebase/database'
import { app } from '@/services/firebase'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createEbook } from '@/services/ebook'
import { toast } from 'sonner'
import { EbookList } from './components/ebook-list';

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)

  const [showNewBookSheet, setShowNewBookSheet] = useState(false)
  const [newBookTitle, setNewBookTitle] = useState('')
  const [newBookSize, setNewBookSize] = useState('')
  const user = getAuth(app).currentUser
  const database = getDatabase(app)

  useEffect(() => {
    const fetchProject = async () => {
      if (!user) {
        router.push('/sign-in')
        return
      }

      try {
        const projectRef = ref(database, `projects/${user.uid}/${params.id}`)
        const snapshot = await get(projectRef)

        if (snapshot.exists()) {
          const projectData = snapshot.val()
          setProject({
            ...projectData,
          })
        } else {
          console.error('Project not found')
          router.push('/projects')
        }
      } catch (error) {
        console.error('Error fetching project:', error)
        router.push('/projects')
      }
    }
    fetchProject()
  }, [user, params.id, database, router])

  const handleCreateBook = async () => {
    if (!newBookTitle.trim() || !newBookSize || !user) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const { ebook, error } = await createEbook(user.uid, params.id as string, {
        title: newBookTitle,
        size: newBookSize,
      })

      if (error) {
        toast.error(error)
        return
      }

      if (ebook) {
        toast.success('Book created successfully')
        setShowNewBookSheet(false)
        setNewBookTitle('')
        setNewBookSize('')
      }
    } catch (error) {
      console.error('Error creating book:', error)
      toast.error('Failed to create book')
    }
  }

  if (!project) {
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
                {new Date(project.createdAt).toLocaleDateString()}
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
                {new Date(project.updatedAt).toLocaleDateString()}
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
                style={{ backgroundColor: project.color }}
              />
              <p className="text-sm">{project.color.toUpperCase()}</p>
            </CardContent>
          </Card>
        </div>
        <div
          className="h-24 rounded-lg relative"
          style={{ backgroundColor: project.color }}
        >
          <div className="absolute bottom-4 left-4">
            <h1 className="text-4xl font-bold text-white">{project.title}</h1>
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
              <Button onClick={handleCreateBook} className="mt-4">
                Create Book
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="mt-8">
        <EbookList userId={user?.uid || ''} projectId={params.id as string} />
      </div>
    </div>
  )
}