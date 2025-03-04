'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon, Pencil, Trash, Search } from 'lucide-react'
import { useProjectFiltering } from '@/types/project'
import { toast } from "sonner"
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { app } from '@/services/firebase'
import { getDatabase, ref, set, get, remove, child, update } from 'firebase/database'
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
  const [open, setOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [newProjectTitle, setNewProjectTitle] = useState('')
  const [newProjectColor, setNewProjectColor] = useState('#6366f1')
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [filters, setFilters] = useState({
    title: '',
    sortOrder: 'newest' as 'newest' | 'oldest'
  })

  const [user, setUser] = useState<User | null>()
  const database = getDatabase(app)

  const projectsList = useProjectFiltering(projects, filters)
  useEffect(() => {
    const auth = getAuth(app)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      if (user) {
        // Load projects when user is authenticated
        loadUserProjects(user.uid)
      } else {
        setProjects([])
      }
    })

    return () => unsubscribe()
  }, [])

  const [isLoading, setIsLoading] = useState(true)
  const loadUserProjects = async (userId: string) => {
    setIsLoading(true)
    try {
      const dbRef = ref(database)
      const snapshot = await get(child(dbRef, `projects/${userId}`))

      if (snapshot.exists()) {
        const projectsData = snapshot.val()
        const projectsList = Object.values(projectsData).map((project: any) => ({
          ...project,
          createdAt: new Date(project.createdAt),
          updatedAt: new Date(project.updatedAt)
        }))
        setProjects(projectsList as Project[])
      } else {
        setProjects([])
      }
    } catch (error) {
      console.error('Error loading projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setIsLoading(false)
    }
  }

  const createProject = async () => {
    if (!newProjectTitle.trim() || !user) return

    try {
      // Check if project with same title exists
      const projectsRef = ref(database, `projects/${user.uid}`)
      const snapshot = await get(projectsRef)

      if (snapshot.exists()) {
        const projects = Object.values(snapshot.val())
        const projectExists = projects.some((project: any) =>
          project.title.toLowerCase() === newProjectTitle.toLowerCase()
        )

        if (projectExists) {
          toast.error('A project with this title already exists')
          return
        }
      }

      const projectId = Date.now().toString()
      await set(ref(database, `projects/${user.uid}/${projectId}`), {
        id: projectId,
        title: newProjectTitle,
        color: newProjectColor,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.uid,
        userName: user.displayName || ""
      })

      setProjects([...projects, {
        id: projectId,
        title: newProjectTitle,
        color: newProjectColor,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user.uid,
        userName: user.displayName || ""
      }])
      setNewProjectTitle('')
      setNewProjectColor('#6366f1')
      setOpen(false)

      toast("Project created", {
        description: `Successfully created project "${newProjectTitle}!"`
      })
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Failed to create project')
    }
  }

  const updateProject = async (id: string, newTitle: string, color: string) => {
    if (!user) return

    const updatedProject = {
      title: newTitle,
      color,
      updatedAt: new Date().toISOString()
    }

    try {
      await update(ref(database, `projects/${user.uid}/${id}`), updatedProject)

      const updatedProjects = projects.map(project =>
        project.id === id
          ? { ...project, title: newTitle, updatedAt: new Date(), color }
          : project
      )
      setProjects(updatedProjects)
      setEditingProject(null)

      toast("Project updated", {
        description: `Successfully updated project "${newTitle}!"`
      })
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Failed to update project')
    }
  }

  const deleteProject = async (id: string) => {
    if (!user) return

    try {
      await remove(ref(database, `projects/${user.uid}/${id}`))
      const updatedProjects = projects.filter(project => project.id !== id)
      setProjects(updatedProjects)

      toast("Project Deleted", {
        description: `Successfully deleted project!`,
        richColors: true
      })
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
    }
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
      setDeleteDialogOpen(false)
      setProjectToDelete(null)
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
            Last edited {new Date(project.updatedAt).toLocaleDateString()}
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
          <div className="w-40">
            <Select
              value={filters.sortOrder}
              onValueChange={(value: 'newest' | 'oldest') =>
                setFilters(prev => ({ ...prev, sortOrder: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            [...Array(4)].map((_, index) => (
              <div key={index} className="border rounded-lg overflow-hidden min-h-28 animate-pulse">
                <div className="h-2 bg-slate-200" />
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-1/2 bg-slate-200 rounded" />
                    <div className="h-8 w-8 bg-slate-200 rounded" />
                  </div>
                  <div className="h-4 w-1/3 bg-slate-200 rounded mt-2" />
                </div>
              </div>
            ))
          ) : renderListProjects()}
        </div>
      </div>
    </div>
  )
}