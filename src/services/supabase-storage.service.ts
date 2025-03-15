import { TBook } from "@/types/ebook";
import { supabase } from "./supabase";
import * as AuthService from "@/services/auth.service";

export const getGeneratedImagesByBookId = async ({ id }: Partial<TBook>) => {
  const { user } = await AuthService.getCurrentUser()

  const { data, error } = await supabase
    .storage
    .from('users-generated-images')
    .list(`${user?.id}/${id}`, {
      sortBy: { column: 'created_at', order: 'desc' },
      limit: 10,
    })

  if (error) throw error;
  return data
};


export const getPublicUrl = async (path: string) => {
  const { user } = await AuthService.getCurrentUser()
  const data = supabase.storage.from('users-generated-images').getPublicUrl(`${user?.id}/${path}`).data.publicUrl
  return {
    publicUrl: data as string
  }
}