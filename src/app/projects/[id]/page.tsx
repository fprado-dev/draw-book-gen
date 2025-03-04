'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Project } from '@/types/project'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarIcon, Clock, Palette, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import GeneratePanel from './components/page'
import { getAuth } from 'firebase/auth'
import { getDatabase, ref, get } from 'firebase/database'
import { app } from '@/services/firebase'

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
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
        <div className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-x-4">
              <div className="h-6 w-24 bg-slate-200 rounded animate-pulse" />
              <div className="h-8 w-32 bg-slate-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="relative flex gap-4">
              <div className="w-[450px] h-[700px] border-2 border-dashed border-slate-200 rounded-lg animate-pulse" />
              <div className="grid grid-cols-2 gap-2 flex-1">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex-1 border-2 border-dashed rounded-lg bg-slate-200 animate-pulse" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  console.log(project)
  return (
    <div className="container mx-auto py-6 ">
      <div className="flex flex-col gap-6 mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="cursor-pointer  w-fit hover:bg-slate-50 hover:text-primary"
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


      <GeneratePanel />
    </div>
  )
}