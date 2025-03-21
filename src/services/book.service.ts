import { supabase } from './supabase';
import { TBook, TBookCreate } from '@/types/ebook';
import * as AuthService from "@/services/auth.service"
import { TProject } from '@/types/TProjects';
import { getThumbnailOptions } from './unsplash.service';

export const getBookThumbnailOptions = async (query?: string) => {
  return getThumbnailOptions(query);
};


export const getProjectBooks = async ({ id }: Partial<TProject>) => {

  const { user } = await AuthService.getCurrentUser()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', user?.id)
    .eq('project_id', id);

  if (error) throw error;

  return data as TBook[];
};

export const getBookById = async ({ id }: Partial<TBook>) => {
  const { user } = await AuthService.getCurrentUser()

  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', user?.id)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as TBook;
}

export const createBook = async ({ title, project_id, size, status, thumbnail_url }: TBookCreate) => {
  const { user } = await AuthService.getCurrentUser()
  const { data, error } = await supabase
    .from('books')
    .insert([
      { title, project_id, size, status, thumbnail_url, user_id: user?.id },
    ])
    .select();
  if (error) throw error;
  return data[0] as TBook;

}

export const updateBookById = async ({ id, title, project_id, size, status, thumbnail_url, pages }: Partial<TBook>) => {
  const { data, error } = await supabase
    .from('books')
    .update({ title, project_id, size, status, thumbnail_url, pages, })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data[0] as TBook;
}

export const deleteBookById = async ({ id }: Partial<TBook>) => {
  const { data, error } = await supabase
    .from('books')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return data;
}

