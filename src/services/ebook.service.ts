import { supabase } from './supabase';
import { Ebook } from '@/types/ebook';

export const createEbook = async (userId: string, projectId: string, ebook: Partial<Ebook>) => {
  try {
    const ebookId = Date.now().toString();
    const newEbook = {
      id: ebookId,
      project_id: projectId,
      user_id: userId,
      title: ebook.title,
      status: 'draft',
      pages: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('ebooks')
      .insert([newEbook])
      .select()
      .single();

    if (error) throw error;

    return { ebook: data, error: null };
  } catch (error) {
    console.error('Error creating ebook:', error);
    return { ebook: null, error: 'Failed to create ebook' };
  }
};

export const getProjectEbooks = async (userId: string, projectId?: string) => {
  try {
    const { data: ebooksData, error } = await supabase
      .from('ebooks')
      .select('*')
      .eq('user_id', userId)
      .eq('project_id', projectId);

    if (error) throw error;

    const ebooks = ebooksData?.map(ebook => ({
      ...ebook,
      created_at: new Date(ebook.created_at),
      updated_at: new Date(ebook.updated_at)
    })) || [];

    return { ebooks, error: null };
  } catch (error) {
    console.error('Error fetching ebooks:', error);
    return { ebooks: [], error: 'Failed to fetch ebooks' };
  }
};

export const updateEbook = async (userId: string, projectId: string, ebookId: string, updates: Partial<Ebook>) => {
  try {
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('ebooks')
      .update(updatedData)
      .eq('id', ebookId)
      .eq('user_id', userId)
      .eq('project_id', projectId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating ebook:', error);
    return { success: false, error: 'Failed to update ebook' };
  }
};

export const deleteEbook = async (userId: string, projectId: string, ebookId: string) => {
  try {
    const { error } = await supabase
      .from('ebooks')
      .delete()
      .eq('id', ebookId)
      .eq('user_id', userId)
      .eq('project_id', projectId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting ebook:', error);
    return { success: false, error: 'Failed to delete ebook' };
  }
};

export const getEbook = async (userId: string, projectId: string, ebookId: string) => {
  try {
    const { data: ebookData, error } = await supabase
      .from('ebooks')
      .select('*')
      .eq('id', ebookId)
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .single();

    if (error) throw error;

    if (ebookData) {
      const ebook = {
        ...ebookData,
        created_at: new Date(ebookData.created_at),
        updated_at: new Date(ebookData.updated_at)
      };
      return { ebook, error: null };
    }

    return { ebook: null, error: 'Ebook not found' };
  } catch (error) {
    console.error('Error fetching ebook:', error);
    return { ebook: null, error: 'Failed to fetch ebook' };
  }
};