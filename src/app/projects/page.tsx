'use client'

// import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircleIcon } from 'lucide-react'
// import { toast } from "sonner"
// import { User } from '@supabase/supabase-js'
// import { supabase } from '@/services/supabase'
// import { useQueryClient } from '@tanstack/react-query'
// import { motion, AnimatePresence } from 'framer-motion';

// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet"
// import { Input } from "@/components/ui/input"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"
// import { MoreVertical } from 'lucide-react'
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
// import { useRouter } from 'next/navigation'
// import { formatDate } from '@/lib/date'
// import * as ProjectServices from '@/services/projects.service'
// import { TProject } from '@/types/TProjects'
// import { Card, CardContent } from '@/components/ui/card'
import { BentoGrid } from './components/card'

export default function ProjectsPage() {
  // const router = useRouter()
  // const queryClient = useQueryClient()
  // const [, setOpen] = useState(false)
  // const [, setEditDialogOpen] = useState(false)
  // const [newProjectTitle, setNewProjectTitle] = useState('')
  // const [newProjectColor, setNewProjectColor] = useState('#8da9c4')
  // const [, setEditingProject] = useState<TProject | null>(null)
  // const [, setDeleteDialogOpen] = useState(false)
  // const [, setProjectToDelete] = useState<TProject | null>(null)
  // const [, setFilters] = useState({
  //   title: '',
  //   sortOrder: 'newest' as 'newest' | 'oldest'
  // })

  // const [user, setUser] = useState<User | null>(null)

  // useEffect(() => {
  //   const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {

  //     setUser(session?.user || null)
  //   })

  //   return () => subscription.unsubscribe()
  // }, [])

  // const { data: projectList, } = useQuery({
  //   queryKey: ['projects'],
  //   queryFn: ProjectServices.getAllProjects,
  //   enabled: !!user?.id,

  // })

  // const now = new Date();
  // const thisMonth = projectList?.filter(img => {
  //   const imgDate = new Date(img.created_at);
  //   return imgDate.getMonth() === now.getMonth() && imgDate.getFullYear() === now.getFullYear();
  // }).length;


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



  // const StatCard = ({ icon: Icon, label, value }: { icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>; label: string; value: number | string }) => (

  //   <Card className="bg-white/50 backdrop-blur-sm border border-slate-200 flex flex-1 w-full">
  //     <CardContent className="flex items-center p-6">
  //       <div className="rounded-full p-2 bg-primary/10">
  //         <Icon className="h-6 w-6 text-primary" />
  //       </div>
  //       <div className="ml-4">
  //         <p className="text-sm font-medium text-muted-foreground">{label}</p>
  //         <h3 className="text-2xl font-bold">{value}</h3>
  //       </div>
  //     </CardContent>
  //   </Card>
  // );

  // const container = {
  //   hidden: { opacity: 0 },
  //   show: {
  //     opacity: 1,
  //     transition: {
  //       staggerChildren: 0.1
  //     }
  //   }
  // };

  // const item = {
  //   hidden: { opacity: 0, y: 20 },
  //   show: { opacity: 1, y: 0 }
  // };
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
      <BentoGrid />

    </div>
  )
}



// <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="grid grid-cols-1 md:grid-cols-3 gap-4"
//       >
//         <StatCard
//           icon={FolderOpen}
//           label="Total Projects"
//           value={projectList?.length || 0}
//         />
//         <StatCard
//           icon={FolderDotIcon}
//           label="Created this month"
//           value={thisMonth || 0}
//         />
//         <StatCard
//           icon={BookCheck}
//           label="Avg. Books per project"
//           value={10}
//         />
//       </motion.div>
//       <div className="flex gap-4 mb-6 mt-6 w-full">
//         <div className="flex-1 w-full">
//           <div className="relative w-full">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
//             <Input
//               className="pl-10 border border-slate-200"
//               placeholder="Search by title..."
//               value={filters.title}
//               onChange={(e) => setFilters(prev => ({ ...prev, title: e.target.value }))}
//             />
//           </div>
//         </div>
//         <Sheet open={open} onOpenChange={setOpen}>
//           <SheetTrigger asChild>
//             <div className="flex items-center gap-4">
//               <Button className="cursor-pointer">
//                 <PlusIcon className="w-4 h-4" />
//                 New Project
//               </Button>
//             </div>
//           </SheetTrigger>
//           <SheetContent className='border-none'>
//             <SheetHeader>
//               <SheetTitle>
//                 Choose a title for your new project 😎
//               </SheetTitle>
//               <span className='text-xs text-foreground'>(eg: Mandalas, Illustrations, etc...)</span>
//             </SheetHeader>
//             <div className='flex flex-col gap-4 px-4' >
//               <div >
//                 <Input
//                   placeholder="Enter project title"
//                   value={newProjectTitle}
//                   onChange={(e) => setNewProjectTitle(e.target.value)}
//                 />
//               </div>
//               <div className="flex flex-col gap-4">
//                 <div className="flex flex-wrap items-center gap-2">
//                   <Input
//                     type="color"
//                     value={newProjectColor}
//                     onChange={(e) => setNewProjectColor(e.target.value)}
//                     className="w-12 h-12 p-1 cursor-pointer"
//                   />
//                   {[
//                     '#8da9c4', // Red
//                     '#e63946', // Orange Red
//                     '#fca311', // Dark Orange
//                     '#fb6f92', // Indigo
//                     '#d4a373', // Purple
//                     '#b8c0ff', // Dark Green
//                     '#76c893', // Dark Red
//                   ].map((color) => (
//                     <div
//                       key={color}
//                       onClick={() => setNewProjectColor(color)}
//                       className="w-8 h-8 rounded-full cursor-pointer border border-gray-200 transition-transform hover:scale-110"
//                       style={{ backgroundColor: color }}
//                       title={color}
//                     />
//                   ))}
//                 </div>
//               </div>
//               <Button variant="secondary" onClick={createProject} size="sm" className='p-4 cursor-pointer hover:bg-neutral-800 hover:text-muted'>
//                 Create Project
//               </Button>
//             </div>
//           </SheetContent>

//         </Sheet>
//       </div>

// {
//   isLoadingProjects ? (
//     <motion.div
//       variants={container}
//       initial="hidden"
//       animate="show"
//       className="grid grid-cols-3 px-4 gap-4"
//     >
//       {[...Array(8)].map((_, index) => (
//         <motion.div
//           key={index}
//           variants={item}
//           layout
//           initial={{ opacity: 0, x: -0.8 }}
//           animate={{ opacity: 1, x: 0 }}
//           exit={{ opacity: 0, x: -0.8 }}
//           transition={{ type: 'spring', damping: 20 }}
//         >
//           <div className="border rounded-lg overflow-hidden min-h-28 animate-pulse">
//             <div className="h-2 bg-slate-200" />
//             <div className="p-4">
//               <div className="flex justify-between items-center">
//                 <div className="h-4 w-48 bg-slate-200 rounded" />
//                 <div className="h-8 w-8 bg-slate-200 rounded" />
//               </div>
//               <div className="mt-2 h-4 w-32 bg-slate-200 rounded" />
//             </div>
//           </div>
//         </motion.div>
//       ))}
//     </motion.div>
//   ) : projectList?.length === 0 ? (
//     <div className="text-center py-12">
//       <p className="text-muted-foreground">No images found. Generate some images in your books!</p>
//     </div>
//   )
//     : (
//       <motion.div
//         variants={container}
//         initial="hidden"
//         animate="show"
//         className="grid grid-cols-3 gap-4"
//       >
//         <AnimatePresence>
//           {projectList?.map((project) => (
//             <motion.div
//               key={project.id}
//               variants={item}
//               layout
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.8 }}
//               transition={{ type: 'spring', damping: 20 }}
//               className='w-full '
//             >
//               <Card key={project.id} className='cursor-pointer relative flex flex-col gap-2 border-stone-100 w-full' style={{ boxShadow: `0 4px 6px -1px ${project.color}40, 0 2px 4px -2px ${project.color}40` }}>
//                 <CardHeader className='relative'>
//                   <span className="flex items-center gap-2 text-xs text-gray-500">
//                     {`Last time updated ${formatDate(project.updated_at)}`}
//                   </span>

//                 </CardHeader>
//                 <CardContent>
//                   <CardTitle
//                     className="cursor-pointer hover:underline text-2xl"
//                     onClick={() => handleViewProjectId(project)}
//                   >
//                     {project.title}
//                   </CardTitle>

//                 </CardContent>
//                 <div className="cursor-pointer absolute top-4 right-4">
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
//                         <MoreVertical className="h-4 w-4" />
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-40" align="end">
//                       <div className="flex flex-col space-y-1">
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="justify-start"
//                           onClick={() => handleEdit(project)}
//                         >
//                           <Pencil className="h-4 w-4 mr-2" />
//                           Edit
//                         </Button>
//                         <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//                           <AlertDialogContent>
//                             <AlertDialogHeader>
//                               <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                               <AlertDialogDescription>
//                                 This action cannot be undone. This will permanently delete your project
//                                 {`"${projectToDelete?.title}"`} and all books created on this project.
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>
//                             <AlertDialogFooter>
//                               <AlertDialogCancel onClick={() => setProjectToDelete(null)}>
//                                 Cancel
//                               </AlertDialogCancel>
//                               <AlertDialogAction
//                                 onClick={handleConfirmDelete}
//                                 className="bg-red-600 hover:bg-red-700"
//                               >
//                                 Delete
//                               </AlertDialogAction>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="justify-start text-red-600 hover:text-red-600 hover:bg-red-100"
//                           onClick={() => handleDeleteClick(project)}
//                         >
//                           <Trash className="h-4 w-4 mr-2" />
//                           Delete
//                         </Button>
//                       </div>
//                     </PopoverContent>
//                   </Popover>
//                 </div>
//               </Card>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </motion.div>
//     )
// }
// <Sheet open={editDialogOpen} onOpenChange={setEditDialogOpen}>
//   <SheetContent className='border-none'>
//     <SheetHeader>
//       <SheetTitle>
//         Edit the title for this project 😎
//       </SheetTitle>
//       <span className='text-xs text-foreground'>(you can edit title and color.)</span>
//     </SheetHeader>
//     <div className='flex flex-col gap-4 px-4' >
//       <div >
//         <Input
//           placeholder="Enter a project title"
//           value={editingProject?.title || ''}
//           onChange={(e) => setEditingProject(prev =>
//             prev ? { ...prev, title: e.target.value } : null
//           )}
//         />
//       </div>
//       <div className="flex flex-col gap-4">
//         <div className="flex flex-wrap items-center gap-2">
//           <Input
//             type="color"
//             value={editingProject?.color || '#6366f1'}
//             onChange={(e) => setEditingProject(prev =>
//               prev ? { ...prev, color: e.target.value } : null
//             )}
//             className="w-12 h-12 p-1 cursor-pointer"
//           />
//           {[
//             '#8da9c4', // Red
//             '#e63946', // Orange Red
//             '#fca311', // Dark Orange
//             '#fb6f92', // Indigo
//             '#d4a373', // Purple
//             '#b8c0ff', // Dark Green
//             '#76c893', // Dark Red
//           ].map((color) => (
//             <div
//               key={color}
//               onClick={() => setNewProjectColor(color)}
//               className="w-8 h-8 rounded-full cursor-pointer border border-gray-200 transition-transform hover:scale-110"
//               style={{ backgroundColor: color }}
//               title={color}
//             />
//           ))}
//         </div>
//       </div>
//       <Button variant="secondary" onClick={() => {
//         if (editingProject) {
//           updateProject(
//             editingProject.id,
//             editingProject.title,
//             editingProject.color
//           )
//           setEditDialogOpen(false)
//         }
//       }} size="sm" className='p-4 cursor-pointer hover:bg-neutral-800 hover:text-muted'>
//         Update Project
//       </Button>
//     </div>
//   </SheetContent>
// </Sheet> *