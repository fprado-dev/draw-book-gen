"use server"

import { TBook, TBookStatus } from '@/types/ebook';
import { createClient } from '@/utils/supabase/server';



export const onCreateBook = async (formaData: FormData, status: TBookStatus) => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth?.getUser()

  const title = formaData.get("title") as string;
  const size = formaData.get("size") as string;

  console.log({ title, size, status })
  const { data, error } = await supabase
    .from('books')
    .insert([{
      title, size, status, user_id: user?.id,
    }
    ]).single();

  if (error) throw error;
  return data;
}

// export const createBook = async ({ title, size, status }: Omit<TBook, "id" | "created_at" | "updated_at" | "last_viewed">) => {
//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth?.getUser()
//   const { data, error } = await supabase
//     .from('books')
//     .insert([
//       { title, size, status, user_id: user?.id },
//     ])
//     .select();
//   if (error) throw error;
//   return data[0] as TBook;

// }

// export const updateBookById = async ({ id, title, size, status }: Partial<TBook>) => {
//   const { user } = await AuthService.getCurrentUser()

//   const { data, error } = await supabase
//     .from('books')
//     .update({ title, project_id: "0", size, status })
//     .eq('id', id)
//     .eq('user_id', user?.id)
//     .select();
//   if (error) throw error;
//   console.log({ data, title, project_id: "0", size, status })
//   return data[0] as TBook;
// }

// export const deleteBookById = async ({ id }: Partial<TBook>) => {
//   const { data, error } = await supabase
//     .from('books')
//     .delete()
//     .eq('id', id);
//   if (error) throw error;
//   return data;
// }

