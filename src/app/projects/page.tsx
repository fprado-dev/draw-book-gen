'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon, Pencil, Trash, Search } from 'lucide-react'
import { toast } from "sonner"
import { User } from '@supabase/supabase-js'
import { supabase } from '@/services/supabase'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MoreVertical } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/date'
import * as ProjectServices from '@/services/projects.service'
import { TProject, TUpdateProject } from '@/types/TProjects'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProjectsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [newProjectTitle, setNewProjectTitle] = useState('')
  const [newProjectColor, setNewProjectColor] = useState('#8da9c4')
  const [editingProject, setEditingProject] = useState<TProject | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<TProject | null>(null)
  const [filters, setFilters] = useState({
    title: '',
    sortOrder: 'newest' as 'newest' | 'oldest'
  })
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {

      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const { data: projectList, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: ProjectServices.getAllProjects,
    enabled: !!user?.id
  })



  const validateIfTitleProjectExists = (title: string) => {
    const projectExists = projectList?.some(project => {
      return project.title.toLowerCase() === title.toLowerCase()
    })
    if (projectExists) {
      throw new Error("Project already exists");
    }

  }


  const createProjectMutation = useMutation({
    mutationFn: async () => {
      if (!newProjectTitle.trim() || !user) {
        // toast.error("Project title is required")
        throw new Error("Project title is required")
      }
      if (newProjectTitle.trim()) {
        validateIfTitleProjectExists(newProjectTitle)
        await ProjectServices.createProject({ title: newProjectTitle, color: newProjectColor })

      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setNewProjectTitle('')
      setNewProjectColor('#6366f1')
      setOpen(false)
      toast("Project created", {
        description: `Successfully created project "${newProjectTitle}!"`
      })
    },
    onError: (error) => {
      console.error('Error creating project:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create project')
    }
  })

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, title, color }: TUpdateProject) => {
      if (!user) return

      return await ProjectServices.updateProject({ id, title, color })
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setEditingProject(null)
      toast("Project updated", {
        description: `Successfully updated project "${data?.title}!"`
      })
    },
    onError: (error) => {
      console.error('Error updating project:', error)
      toast.error('Failed to update project')
    }
  })

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) return
      return await ProjectServices.deleteProject({ id: id })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setDeleteDialogOpen(false)
      setProjectToDelete(null)
      toast("Project Deleted", {
        description: `Successfully deleted project!`,
      })
    },
    onError: (error) => {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
    }
  })

  const createProject = () => {
    createProjectMutation.mutate()
  }

  const updateProject = (id: string, newTitle: string, color: string) => {
    updateProjectMutation.mutate({ id, title: newTitle, color })
  }

  const deleteProject = (id: string) => {
    deleteProjectMutation.mutate(id)
  }

  const handleEdit = (project: TProject) => {
    setEditingProject(project)
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (project: TProject) => {
    setProjectToDelete(project)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id)
    }
  }

  const handleViewProjectId = async (project: TProject) => {
    localStorage.setItem('illustra-current-project', JSON.stringify(project))
    router.push(`/projects/${project.id}`)

  }

  const renderListProjects = () => {
    return projectList?.map((project) => (
      <Card key={project.id} className='cursor-pointer relative flex flex-col gap-2 border-stone-100' style={{ boxShadow: `0 4px 6px -1px ${project.color}40, 0 2px 4px -2px ${project.color}40` }}>
        <CardHeader className='relative'>
          <span className="flex items-center gap-2 text-xs text-gray-500">
            {`Last time updated ${formatDate(project.updated_at)}`}
          </span>

        </CardHeader>
        <CardContent>
          <CardTitle
            className="cursor-pointer hover:underline text-2xl"
            onClick={() => handleViewProjectId(project)}
          >
            {project.title}
          </CardTitle>

        </CardContent>
        <div className="cursor-pointer absolute top-4 right-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40" align="end">
              <div className="flex flex-col space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  onClick={() => handleEdit(project)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your project
                        "{projectToDelete?.title}" and all books created on this project.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setProjectToDelete(null)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleConfirmDelete}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start text-red-600 hover:text-red-600 hover:bg-red-100"
                  onClick={() => handleDeleteClick(project)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </Card>


    ))
  }

  return (
    <>
      <div className="flex flex-col px-4">
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                className="pl-10 border border-slate-400"
                placeholder="Search by title..."
                value={filters.title}
                onChange={(e) => setFilters(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <div className="flex items-center gap-4">
                <Button className="cursor-pointer">
                  <PlusIcon className="w-4 h-4" />
                  New Project
                </Button>
              </div>
            </SheetTrigger>
            <SheetContent className='border-none'>
              <SheetHeader>
                <SheetTitle>
                  Choose a title for your new project 😎
                </SheetTitle>
                <span className='text-xs text-foreground'>(eg: Mandalas, Illustrations, etc...)</span>
              </SheetHeader>
              <div className='flex flex-col gap-4 px-4' >
                <div >
                  <Input
                    placeholder="Enter project title"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Input
                      type="color"
                      value={newProjectColor}
                      onChange={(e) => setNewProjectColor(e.target.value)}
                      className="w-12 h-12 p-1 cursor-pointer"
                    />
                    {[
                      '#8da9c4', // Red
                      '#e63946', // Orange Red
                      '#fca311', // Dark Orange
                      '#fb6f92', // Indigo
                      '#d4a373', // Purple
                      '#b8c0ff', // Dark Green
                      '#76c893', // Dark Red
                    ].map((color) => (
                      <div
                        key={color}
                        onClick={() => setNewProjectColor(color)}
                        className="w-8 h-8 rounded-full cursor-pointer border border-gray-200 transition-transform hover:scale-110"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                <Button variant="secondary" onClick={createProject} size="sm" className='p-4 cursor-pointer hover:bg-neutral-800 hover:text-muted'>
                  Create Project
                </Button>
              </div>
            </SheetContent>

          </Sheet>
        </div>

      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {isLoadingProjects && (
          <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border rounded-lg overflow-hidden min-h-28 animate-pulse">
                <div className="h-2 bg-slate-200" />
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-48 bg-slate-200 rounded" />
                    <div className="h-8 w-8 bg-slate-200 rounded" />
                  </div>
                  <div className="mt-2 h-4 w-32 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}
        {projectList?.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-slate-100 p-3">
              <PlusIcon className="h-6 w-6 text-slate-600" />
            </div>
            <h3 className="mb-2 text-lg font-medium">No projects yet</h3>
            <p className="mb-4 text-sm text-gray-500">
              Create your first project to start generating AI-powered illustrations
            </p>
            <Button
              onClick={() => setOpen(true)}
              className="cursor-pointer bg-slate-600 hover:bg-slate-700"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Create New Project
            </Button>
          </div>
        ) : (
          renderListProjects()
        )}
      </div>
      <Sheet open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <SheetContent className='border-none'>
          <SheetHeader>
            <SheetTitle>
              Edit the title for this project 😎
            </SheetTitle>
            <span className='text-xs text-foreground'>(you can edit title and color.)</span>
          </SheetHeader>
          <div className='flex flex-col gap-4 px-4' >
            <div >
              <Input
                placeholder="Enter a project title"
                value={editingProject?.title || ''}
                onChange={(e) => setEditingProject(prev =>
                  prev ? { ...prev, title: e.target.value } : null
                )}
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  type="color"
                  value={editingProject?.color || '#6366f1'}
                  onChange={(e) => setEditingProject(prev =>
                    prev ? { ...prev, color: e.target.value } : null
                  )}
                  className="w-12 h-12 p-1 cursor-pointer"
                />
                {[
                  '#8da9c4', // Red
                  '#e63946', // Orange Red
                  '#fca311', // Dark Orange
                  '#fb6f92', // Indigo
                  '#d4a373', // Purple
                  '#b8c0ff', // Dark Green
                  '#76c893', // Dark Red
                ].map((color) => (
                  <div
                    key={color}
                    onClick={() => setNewProjectColor(color)}
                    className="w-8 h-8 rounded-full cursor-pointer border border-gray-200 transition-transform hover:scale-110"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
            <Button variant="secondary" onClick={() => {
              if (editingProject) {
                updateProject(
                  editingProject.id,
                  editingProject.title,
                  editingProject.color
                )
                setEditDialogOpen(false)
              }
            }} size="sm" className='p-4 cursor-pointer hover:bg-neutral-800 hover:text-muted'>
              Update Project
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
