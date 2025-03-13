import { TNewProject, TProject } from "@/types/TProjects"
import * as Auth from "./auth.service"
import { supabase } from "./supabase"
import { User } from "@supabase/supabase-js"


export const getAllProjects = async () => {
  const { user } = await Auth.getCurrentUser()
  if (!user?.id) return []
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
  return data as TProject[]
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