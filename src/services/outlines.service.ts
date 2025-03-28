'use server';

import { Outline } from '@/types/outlines';
import { createClient } from '@/utils/supabase/server';

/**
 * Creates a new outline in Supabase
 * @param outline The outline data to create
 * @returns The created outline or error
 */
export async function createOutline(
  outline: Omit<Outline, 'id'>
): Promise<{ success: boolean; error?: string; data?: Outline }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth?.getUser();
  try {
    // Validate input
    if (!outline.title || !user?.id || !Array.isArray(outline.chapters)) {
      throw new Error('Invalid outline data: Missing required fields');
    }

    if (outline.chapters.length === 0) {
      throw new Error('Invalid outline data: Chapters array cannot be empty');
    }

    // Validate each chapter
    for (const chapter of outline.chapters) {
      if (!chapter.title || !chapter.description) {
        throw new Error('Invalid chapter data: Missing title or description');
      }
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('outlines')
      .insert([
        {
          title: outline.title,
          user_id: user.id,
          chapters: outline.chapters,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data: data as Outline,
    };
  } catch (error) {
    console.error('Error creating outline:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

/**
 * Retrieves all outlines for a specific user
 * @param userId The ID of the user
 * @returns Array of outlines or error
 */
export async function getOutlinesByUserId(
  page: number = 1,
  limit: number = 6
): Promise<{
  success: boolean;
  error?: string;
  data?: Outline[];
  total?: number;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth?.getUser();
  try {
    const offset = (page - 1) * limit;

    const [{ count }, { data }] = await Promise.all([
      supabase
        .from('outlines')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id),
      supabase
        .from('outlines')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1),
    ]);

    return {
      success: true,
      data: data as Outline[],
      total: count!,
    };
  } catch (error) {
    console.error('Error retrieving outlines:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

export async function deleteOutline({
  outline_id,
}: {
  outline_id: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth?.getUser();

  try {
    const { error } = await supabase
      .from('outlines')
      .delete()
      .eq('id', outline_id)
      .eq('user_id', user?.id);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting outline:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
