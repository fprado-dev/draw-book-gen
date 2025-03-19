import { useMemo } from 'react';

export function useProjectFiltering(projects: Project[], filters: ProjectFilterOptions) {
  return useMemo(() => {
    const filteredProjects = projects.filter(project => {
      // Title filter
      if (filters.title && !project.title.toLowerCase().includes(filters.title.toLowerCase())) {
        return false;
      }
      return true;
    });

    // Sort by date
    filteredProjects.sort((a, b) => {
      if (filters.sortOrder === 'newest') {
        return b.created_at.getTime() - a.created_at.getTime();
      } else {
        return a.created_at.getTime() - b.created_at.getTime();
      }
    });

    return filteredProjects;
  }, [projects, filters]);
}

export interface Project {
  id: string;
  title: string;
  color: string;
  created_at: Date;
  updated_at: Date;
  user_id?: string;
  user_name?: string;
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
