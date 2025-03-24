/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EmptyState } from '@/components/ui/empty-state'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { FolderCheckIcon, FolderOpenDotIcon, PlusCircleIcon } from 'lucide-react'
import { BentoItem, BentoCard } from '@/components/ui/bento-card'

import { TProject } from '@/types/TProjects'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import * as ProjectsServices from '@/services/projects.service'
import { toast } from 'sonner'
import { ProjectSheet } from './components/project-sheet'

export default function ProjectsPage() {
  const router = useRouter()
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9
  const [projectToDelete, setProjectToDelete] = useState<BentoItem<TProject> | null>(null)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)


  const [isOpenCreateSheet, setOpenCreateSheet] = useState(false);
  const [titleName, setTitleName] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [currentKeyword, setCurrentKeyword] = useState('')
  const [currentColor, setSelectedColor] = useState('#E5E5FF')
  const [isEditMode, setIsEditMode] = useState(false)
  const [projectToEdit, setProjectToEdit] = useState<TProject | null>(null)

  const createProjectMutation = useMutation({
    mutationFn: async () => {
      if (!titleName.trim()) {
        throw new Error("Project title is required")
      }

      return await ProjectsServices.createProject({
        title: titleName.trim(),
        color: currentColor,
        keywords: keywords,
        books_count: 0
      })
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setTitleName('')
      setKeywords([])
      setCurrentKeyword('')
      setSelectedColor('#E5E5FF')
      setOpenCreateSheet(false)
      toast("Project created", {
        description: `Successfully created project "${data?.title}!"`
      })
    },
    onError: (error) => {
      console.error('Error creating project:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create project')
    }
  })

  const updateProjectMutation = useMutation({
    mutationFn: async () => {
      if (!titleName.trim() || !projectToEdit?.id) {
        throw new Error("Project title is required")
      }

      return await ProjectsServices.updateProject({
        id: projectToEdit.id,
        title: titleName.trim(),
        color: currentColor,
        keywords: keywords
      })
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setTitleName('')
      setKeywords([])
      setCurrentKeyword('')
      setSelectedColor('#E5E5FF')
      setOpenCreateSheet(false)
      setIsEditMode(false)
      setProjectToEdit(null)
      toast("Project updated", {
        description: `Successfully updated project "${data?.title}!"`
      })
    },
    onError: (error) => {
      console.error('Error updating project:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update project')
    }
  })

  const handleCreateOrUpdateProject = () => {
    if (isEditMode && projectToEdit) {
      updateProjectMutation.mutate()
    } else {
      createProjectMutation.mutate()
    }
  }

  const { data: projectsData, isLoading: isLoadingProject } = useQuery({
    queryKey: ['projects', currentPage],
    queryFn: () => ProjectsServices.getAllProjects(currentPage, itemsPerPage)
  })

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      return await ProjectsServices.deleteProject({ id: id })
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

  const deleteProject = (id: string) => {
    deleteProjectMutation.mutate(id)
  }

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
    }
  }

  const handleViewProjectId = (project: BentoItem<TProject>) => {
    const projectInfos = {
      id: project.id,
      title: project.title,
    }
    localStorage.setItem('aillustra-current-project', JSON.stringify(projectInfos))
    router.push(`/projects/${project.id}`)
  }

  const handleDeleteOutline = (project: BentoItem<TProject>) => {
    setProjectToDelete(project)
    setDeleteDialogOpen(true)
  }

  const handleEditProject = (project: BentoItem<TProject>) => {
    const projectData = project.meta
    if (projectData) {
      setProjectToEdit(projectData)
      setTitleName(projectData.title)
      setKeywords(projectData.keywords || [])
      setSelectedColor(projectData.color)
      setIsEditMode(true)
      setOpenCreateSheet(true)
    }
  }

  const formatCardProjects = (projects: TProject[]): BentoItem<TProject>[] => {
    const formattedOutlines = projects?.map((project): BentoItem<TProject> => {
      return {
        id: project.id,
        title: project.title,
        status: `${project.books_count} ${project.books_count === 1 ? 'book' : 'books'}`,
        tags: project.keywords || [],
        cta: 'Explore →',
        icon: <FolderOpenDotIcon className="w-4 h-4 text-purple-500" />,
        meta: project,
        color: project.color,
      }
    })
    return formattedOutlines
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="mx-6 flex items-center justify-between gap-8 py-4 md:gap-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Projects</h1>
            <p className="text-muted-foreground mt-2">Organize existing projects and start new ventures effortlessly. </p>
          </div>
          <ProjectSheet
            isOpen={isOpenCreateSheet}
            onOpenChange={(open) => {
              setOpenCreateSheet(open)
              if (!open) {
                // Reset form when closing
                setIsEditMode(false)
                setProjectToEdit(null)
                setTitleName('')
                setKeywords([])
                setCurrentKeyword('')
                setSelectedColor('#E5E5FF')
              }
            }}
            titleName={titleName}
            setTitleName={setTitleName}
            setKeywords={setKeywords}
            keywords={keywords}
            setCurrentKeyword={setCurrentKeyword}
            currentKeyword={currentKeyword}
            onClick={handleCreateOrUpdateProject}
            isLoading={createProjectMutation.isPending || updateProjectMutation.isPending}
            setSelectedColor={setSelectedColor}
            selectedColor={currentColor}
            isEditMode={isEditMode}
          >
            <Button variant="secondary" className="cursor-pointer bg-gradient-to-r from-primary  to-primary/80 text-white">
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </ProjectSheet>
        </div>
        <div className="px-4 lg:px-6 flex flex-col gap-8">
          {isLoadingProject ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm animate-pulse">
                  <div className="space-y-3">
                    <div className="h-4 w-3/4 bg-muted rounded"></div>
                    <div className="h-3 w-full bg-muted rounded"></div>
                    <div className="h-3 w-2/3 bg-muted rounded"></div>
                    <div className="flex gap-2 pt-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-6 w-16 bg-muted rounded-full"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : projectsData?.data && projectsData.data.length > 0 ? (
            <>
              {/* Formatting Project Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {formatCardProjects(projectsData.data).map(project => {
                  return (
                    <BentoCard
                      key={project.id}
                      item={project}
                      onView={() => handleViewProjectId(project)}
                      onDelete={() => handleDeleteOutline(project)}
                      onEdit={() => handleEditProject(project)}
                    />

                  )
                })

                }

                {/* Delete Dialog */}
                <Dialog open={isDeleteDialogOpen} >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone.<br />
                        This will permanently delete your project <span className='font-bold'>{projectToDelete?.title + " "}</span>
                        and remove your data from our servers.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button className='cursor-pointer hover:opacity-95' variant="secondary" onClick={() => setDeleteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button className='cursor-pointer hover:opacity-95' variant="destructive" onClick={() => handleConfirmDelete()}>
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>


              {/* Pagination */}
              {projectsData.total && projectsData.total > itemsPerPage && (
                <div className="flex justify-center mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                          }}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.ceil(projectsData.total / itemsPerPage) }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === i + 1}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(i + 1);
                            }}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < Math.ceil(projectsData?.total! / itemsPerPage)) {
                              setCurrentPage(currentPage + 1);
                            }
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}

            </>
          ) : (
            <EmptyState
              title="No Projects Yet"
              description="Start creating a new project. To help you manage all your books!"
              renderIcon={() => <FolderCheckIcon className="h-8 w-8 text-primary" />}
            />

          )}
        </div>
      </div>
    </div>
  )
}


