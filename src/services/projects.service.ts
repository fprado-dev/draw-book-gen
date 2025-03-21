import { TNewProject, TProject, TUpdateProject } from "@/types/TProjects"
import * as Auth from "./auth.service"
import { supabase } from "./supabase"

export const getAllProjects = async (page = 1, limit = 9) => {
  const { user } = await Auth.getCurrentUser()
  if (!user?.id) return { data: [], total: 0 }

  const start = (page - 1) * limit
  const end = start + limit - 1

  const { data, count } = await supabase
    .from('projects')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .range(start, end)

  return { data: data as TProject[], total: count }
}

export const createProject = async ({ title, color }: TNewProject) => {
  const { user } = await Auth.getCurrentUser()
  if (!user?.id) return null

  const newProject = {
    title,
    color,
    user_id: user.id,
  }

  const { error } = await supabase
    .from('projects')
    .insert([newProject])

  if (error) throw error

  return newProject


}

export const updateProject = async ({ id, color, title }: TUpdateProject) => {
  const { user } = await Auth.getCurrentUser()

  const updatedProject = {
    title,
    color,
  }
  const { error } = await supabase
    .from('projects')
    .update(updatedProject)
    .eq('id', id)
    .eq('user_id', user?.id)

  if (error) throw error

  return { id, title, color }
}

export const deleteProject = async ({ id }: TUpdateProject) => {
  const { user } = await Auth.getCurrentUser()

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', user?.id)


  if (error) throw error

  return { id }
}

export const getProjectById = async ({ id }: Partial<TProject>) => {
  const { user } = await Auth.getCurrentUser()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('user_id', user?.id)
    .single()

  if (error) throw error
  return data as TProject
}