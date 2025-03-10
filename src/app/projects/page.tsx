'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon, Pencil, Trash, Search } from 'lucide-react'
import { useProjectFiltering } from '@/types/project'
import { toast } from "sonner"
import { User } from '@supabase/supabase-js'
import { supabase } from '@/services/supabase'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Project } from '@/types/project'
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

export default function ProjectsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [newProjectTitle, setNewProjectTitle] = useState('')
  const [newProjectColor, setNewProjectColor] = useState('#6366f1')
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
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

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      const { data: projectsData, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error

      return projectsData?.map(project => ({
        ...project,
        created_at: new Date(project.created_at),
        updated_at: new Date(project.updated_at)
      })) || []
    },
    enabled: !!user?.id
  })

  const projectsList = useProjectFiltering(projects, filters)

  const createProjectMutation = useMutation({
    mutationFn: async () => {
      if (!newProjectTitle.trim() || !user) return

      const { data: existingProject, error: checkError } = await supabase
        .from('projects')
        .select('title')
        .eq('user_id', user.id)
        .eq('title', newProjectTitle)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
      }

      if (existingProject) {
        throw new Error('A project with this title already exists')
      }

      const projectId = Date.now().toString()
      const newProject = {
        id: projectId,
        title: newProjectTitle,
        color: newProjectColor,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: user.id,
        user_name: user.user_metadata?.full_name || ""
      }

      const { error } = await supabase
        .from('projects')
        .insert([newProject])

      if (error) throw error

      return newProject
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
    mutationFn: async ({ id, newTitle, color }: { id: string; newTitle: string; color: string }) => {
      if (!user) return

      const updatedProject = {
        title: newTitle,
        color,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('projects')
        .update(updatedProject)
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      return { id, newTitle, color }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setEditingProject(null)
      toast("Project updated", {
        description: `Successfully updated project "${data?.newTitle}!"`
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

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setDeleteDialogOpen(false)
      setProjectToDelete(null)
      toast("Project Deleted", {
        description: `Successfully deleted project!`,
        richColors: true
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
    updateProjectMutation.mutate({ id, newTitle, color })
  }

  const deleteProject = (id: string) => {
    deleteProjectMutation.mutate(id)
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id)
    }
  }

  const handleViewProjectId = async (projectId: string) => {
    router.push(`/projects/${projectId}`)
  }

  const renderListProjects = () => {
    return projectsList.map((project) => (
      <div key={project.id} className="border rounded-lg overflow-hidden min-h-28 " >
        <div
          className="h-2"
          style={{ backgroundColor: project.color }}
        />
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h3 onClick={() => handleViewProjectId(project.id)}
              className="cursor-pointer font-medium hover:underline">{project.title}</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                          "{projectToDelete?.title}".
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
          <p className="text-sm text-gray-500">
            Last edited {new Date(project.updated_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    ))
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Projects</h1>

          <div className="flex gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <div className="flex items-center gap-4">
                  <Button className="cursor-pointer bg-slate-600 hover:bg-slate-700">
                    <PlusIcon className="w-4 h-4" />
                    Create New Project
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <Input
                    placeholder="Project Title"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={newProjectColor}
                      onChange={(e) => setNewProjectColor(e.target.value)}
                      className="w-12 h-12 p-1 cursor-pointer"
                    />
                    <span className="text-sm text-gray-500">Choose project color</span>
                  </div>
                  <Button onClick={createProject}>Create Project</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Project Title"
                value={editingProject?.title || ''}
                onChange={(e) => setEditingProject(prev =>
                  prev ? { ...prev, title: e.target.value } : null
                )}
              />
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={editingProject?.color || '#6366f1'}
                  onChange={(e) => setEditingProject(prev =>
                    prev ? { ...prev, color: e.target.value } : null
                  )}
                  className="w-12 h-12 p-1 cursor-pointer"
                />
                <span className="text-sm text-gray-500">Choose project color</span>
              </div>
              <Button onClick={() => {
                if (editingProject) {
                  updateProject(
                    editingProject.id,
                    editingProject.title,
                    editingProject.color
                  )
                  setEditDialogOpen(false)
                }
              }}>
                Update Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                className="pl-10"
                placeholder="Search by title..."
                value={filters.title}
                onChange={(e) => setFilters(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
          </div>
        </div>

      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderListProjects()}
      </div>
    </div>
  )
}
