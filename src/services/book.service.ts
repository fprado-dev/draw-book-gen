'use server';

import {
  TBook,
  TBookMeasurementUnit,
  TBookPaperColor,
  TBookStatus,
  TBookType,
} from '@/types/ebook';
import { createClient } from '@/utils/supabase/server';

export const onCreateBook = async (
  formaData: FormData,
  status: TBookStatus,
  paperColor: TBookPaperColor,
  bookType: TBookType,
  unit: TBookMeasurementUnit
) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth?.getUser();

  const title = formaData.get('title') as string;
  const size = formaData.get('size') as string;

  const { data, error } = await supabase
    .from('books')
    .insert([
      {
        title,
        size,
        status,
        paper_color: paperColor,
        book_type: bookType,
        measurement_unit: unit,
        user_id: user?.id,
      },
    ])
    .single();

  if (error) throw error;
  return data;
};

export const getBookById = async (id: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth?.getUser();
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .eq('user_id', user?.id)
    .single();
  if (error) throw error;
  return data as TBook;
};

export const onUpdateBook = async (
  book: Omit<TBook, 'user_id' | 'created_at' | 'updated_at' | 'last_viewed'>
) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth?.getUser();
  const { data, error } = await supabase
    .from('books')
    .update({
      title: book.title,
      size: book.size,
      status: book.status,
      paper_color: book.paper_color,
      book_type: book.book_type,
      measurement_unit: book.measurement_unit,
    })
    .eq('id', book.id)
    .eq('user_id', user?.id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getAllBooks = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth?.getUser();

  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return {
    books: data as TBook[],
  };
};

export const deleteBook = async (id: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth?.getUser();
  const { data, error } = await supabase
    .from('books')
    .delete()
    .eq('id', id)
    .eq('user_id', user?.id);
  if (error) throw error;
  return data;
};



type TgetPagesByBookId = {
  bookId: string;
};

export type TPage = {
  id: string;
  book_id: string;
  user_id: string;
  image_url: string;
  sequence_number: number;
};
export const getAllPagesByBookId = async (bookId: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth?.getUser();
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('user_id', user?.id)
    .eq('book_id', bookId)
    .order('sequence_number', { ascending: true });

  if (error) throw error;
  return {
    pages: data as TPage[],
  };
};


export const onCreatePage = async (bookId: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth?.getUser();

  const { data, error } = await supabase
    .from('pages')
    .insert([
      {
        book_id: bookId,
        user_id: user?.id,
      },
    ])
    .single();

  if (error) throw error;
  return data;
};

