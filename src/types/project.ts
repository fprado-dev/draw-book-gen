import { useMemo } from 'react';

export function useProjectFiltering(projects: Project[], filters: ProjectFilterOptions) {
  return useMemo(() => {
    let filteredProjects = projects.filter(project => {
      // Title filter
      if (filters.title && !project.title.toLowerCase().includes(filters.title.toLowerCase())) {
        return false;
      }
      return true;
    });

    // Sort by date
    filteredProjects.sort((a, b) => {
      if (filters.sortOrder === 'newest') {
        return b.createdAt.getTime() - a.createdAt.getTime();
      } else {
        return a.createdAt.getTime() - b.createdAt.getTime();
      }
    });

    return filteredProjects;
  }, [projects, filters]);
}

export interface Project {
  id: string;
  title: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  userName?: string;
}
export type ProjectFilterOptions = {
  title?: string;
  sortOrder: 'newest' | 'oldest';
}

export type ProjectSortKey = 'title' | 'createdAt' | 'updatedAt';
export type SortOrder = 'asc' | 'desc';

export interface ProjectSortOptions {
  key: ProjectSortKey;
  order: SortOrder;
}
