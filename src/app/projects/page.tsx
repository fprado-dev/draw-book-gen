/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

'use client'

import { Button } from '@/components/ui/button'
import { FolderOpenDotIcon, PlusCircleIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import * as ProjectsServices from '@/services/projects.service'
import { TProject } from '@/types/TProjects'
import { BentoItem, BentoCard } from '@/components/ui/bento-card'
import { useState } from 'react'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

export default function ProjectsPage() {


  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects', currentPage],
    queryFn: () => ProjectsServices.getAllProjects(currentPage, itemsPerPage)
  })


  // const validateIfTitleProjectExists = (title: string) => {
  //   const projectExists = projectList?.some(project => {
  //     return project.title.toLowerCase() === title.toLowerCase()
  //   })
  //   if (projectExists) {
  //     throw new Error("Project already exists");
  //   }

  // }


  // const createProjectMutation = useMutation({
  //   mutationFn: async () => {
  //     if (!newProjectTitle.trim() || !user) {
  //       // toast.error("Project title is required")
  //       throw new Error("Project title is required")
  //     }
  //     if (newProjectTitle.trim()) {
  //       validateIfTitleProjectExists(newProjectTitle)
  //       await ProjectServices.createProject({ title: newProjectTitle, color: newProjectColor })

  //     }
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['projects'] })
  //     setNewProjectTitle('')
  //     setNewProjectColor('#6366f1')
  //     setOpen(false)
  //     toast("Project created", {
  //       description: `Successfully created project "${newProjectTitle}!"`
  //     })
  //   },
  //   onError: (error) => {
  //     console.error('Error creating project:', error)
  //     toast.error(error instanceof Error ? error.message : 'Failed to create project')
  //   }
  // })

  // const updateProjectMutation = useMutation({
  //   mutationFn: async ({ id, title, color }: TUpdateProject) => {
  //     if (!user) return

  //     return await ProjectServices.updateProject({ id, title, color })
  //   },
  //   onSuccess: (data) => {
  //     queryClient.invalidateQueries({ queryKey: ['projects'] })
  //     setEditingProject(null)
  //     toast("Project updated", {
  //       description: `Successfully updated project "${data?.title}!"`
  //     })
  //   },
  //   onError: (error) => {
  //     console.error('Error updating project:', error)
  //     toast.error('Failed to update project')
  //   }
  // })

  // const deleteProjectMutation = useMutation({
  //   mutationFn: async (id: string) => {
  //     if (!user) return
  //     return await ProjectServices.deleteProject({ id: id })
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['projects'] })
  //     setDeleteDialogOpen(false)
  //     setProjectToDelete(null)
  //     toast("Project Deleted", {
  //       description: `Successfully deleted project!`,
  //     })
  //   },
  //   onError: (error) => {
  //     console.error('Error deleting project:', error)
  //     toast.error('Failed to delete project')
  //   }
  // })

  // const createProject = () => {
  //   createProjectMutation.mutate()
  // }

  // const updateProject = (id: string, newTitle: string, color: string) => {
  //   updateProjectMutation.mutate({ id, title: newTitle, color })
  // }

  // const deleteProject = (id: string) => {
  //   deleteProjectMutation.mutate(id)
  // }

  // const handleEdit = (project: TProject) => {
  //   setEditingProject(project)
  //   setEditDialogOpen(true)
  // }

  // const handleDeleteClick = (project: TProject) => {
  //   setProjectToDelete(project)
  //   setDeleteDialogOpen(true)
  // }

  // const handleConfirmDelete = () => {
  //   if (projectToDelete) {
  //     deleteProject(projectToDelete.id)
  //   }
  // }

  // const handleViewProjectId = async (project: TProject) => {
  //   localStorage.setItem('illustra-current-project', JSON.stringify(project))
  //   router.push(`/projects/${project.id}`)

  // }


  const formatCardProjects = (projects: TProject[]): BentoItem<TProject>[] => {

    const formattedOutlines = projects?.map((project): BentoItem<TProject> => {
      return {
        title: project.title,
        description: project.description || '',
        tags: project.keywords || [],
        cta: 'Explore →',
        status: project.ebooks_count ? `${project.ebooks_count.toString()} Books` : "0 Books",
        icon: <FolderOpenDotIcon className="w-4 h-4 text-purple-500" />,
        meta: project,
      }
    })
    return formattedOutlines
  }

  return (
    <div className="container flex flex-1 flex-col gap-4 px-6 py-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-primary">Projects</h1>
          <p className="text-muted-foreground mt-2">Manage your projects and create new ones </p>
        </div>
        <Button variant="secondary" className="bg-gradient-to-r from-primary  to-primary/80 text-white">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </div>
      {isLoading ? (
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
      ) : (
        <>
          <BentoCard items={formatCardProjects(projectsData?.data || [])} />
          {projectsData?.total && projectsData.total > itemsPerPage && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) setCurrentPage(currentPage - 1)
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.ceil(projectsData.total / itemsPerPage) }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(index + 1)
                        }}
                        isActive={currentPage === index + 1}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < Math.ceil(projectsData?.total! / itemsPerPage)) {
                          setCurrentPage(currentPage + 1)
                        }
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  )
}


