"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { TBook } from "@/types/ebook"
import { TProject } from "@/types/TProjects"
import { House } from "lucide-react"


import { usePathname } from 'next/navigation'
import { Fragment, useEffect, useState } from "react"

const routeLabels: Record<string, string> = {
  outlines: 'Outlines',
  projects: 'Projects',
  'ai-images': 'AI Images',
  books: 'Books'
}

const DynamicBreadCrumb = () => {
  const pathname = usePathname()
  const [currentProject, setCurrentProject] = useState<TProject | null>(null)
  const [currentBook, setCurrentBook] = useState<TBook | null>(null)

  useEffect(() => {
    try {
      const projectData = localStorage.getItem('illustra-current-project')
      const bookData = localStorage.getItem('illustra-current-book')
      setCurrentProject(projectData ? JSON.parse(projectData) : null)
      setCurrentBook(bookData ? JSON.parse(bookData) : null)
    } catch (error) {
      console.error('Error accessing localStorage:', error)
    }
  }, [pathname])

  type TPathSegments = {
    label: string,
    href: string,
    isLast: boolean,
  }

  const getPathSegments = (): TPathSegments[] => {

    // Handle project route
    if (pathname.startsWith('/projects/')) {
      const segments = pathname.split('/')
      if (segments.length === 3) { // URL pattern: /projects/{projectId}
        return [
          {
            label: 'Projects',
            href: '/projects',
            isLast: false,
          },
          {
            label: currentProject?.title || 'Project',
            href: `projects/${currentProject?.id}`,
            isLast: true,
          }
        ]
      }
    }

    if (pathname.startsWith('/books/')) {
      const segments = pathname.split('/')

      if (segments.length === 3) { // URL pattern: /books/{bookId}
        return [
          {
            label: 'Projects',
            href: '/projects',
            isLast: false,
          },
          {
            label: currentProject?.title || 'Project',
            href: `/projects/${currentProject?.id}`,
            isLast: false,
          },
          {
            label: currentBook?.title || 'Book',
            href: pathname,
            isLast: true,
          }
        ]
      }
    }



    return [
      {
        label: routeLabels[pathname.split('/')[1]] || 'Dashboard',
        href: '/',
        isLast: true,
      }]
  }

  const segments = getPathSegments()

  if (segments.length === 0) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <House className="h-4 w-4 text-foreground" /> <span className="text-xs text-foreground">/</span>
        {segments.map((segment, index) => (
          <Fragment key={index}>
            <BreadcrumbItem key={segment.href}>
              {segment.isLast ? (
                <BreadcrumbPage>{segment.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={segment.href}>
                  {segment.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!segment.isLast && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default DynamicBreadCrumb