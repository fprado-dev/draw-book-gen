'use server';

import { TOutlines } from '@/types/outlines';
import { createClient } from '@/utils/supabase/server';
import { generateOutline } from './replicate.service';

/**
 * Creates a new outline in Supabase
 * @param outline The outline data to create
 * @returns The created outline or error
 */

export async function getAllOutlines(): Promise<{
  success: boolean;
  error?: string;
  data?: TOutlines[];
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth?.getUser();
  try {
    const { data, error } = await supabase
      .from('outlines')
      .select('*')
      .order('created_at', { ascending: false })
      .eq('user_id', user?.id);
    if (error) throw error;
    return {
      success: true,
      data: data as TOutlines[],
    };
  } catch (error) {
    console.error('Error getting outlines:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

export async function createOutline({
  title,
  outlineQuantity,
}: {
  title: string;
  outlineQuantity: string;
}): Promise<{
  success: boolean;
  error?: string;
  data?: TOutlines;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth?.getUser();
  try {
    const outlines = await generateOutline({ title, outlineQuantity });

    if (outlines.data) {
      const { data, error } = await supabase
        .from('outlines')
        .insert({ title, ...outlines.data, user_id: user?.id })
        .select()
        .single();
      if (error) throw error;
      return {
        success: true,
        data: data as TOutlines,
      };
    }
    return {
      success: false,
      error: 'Error generating outline',
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

export async function updateOutlineById({
  id,
  title,
}: {
  id: string;
  title: string;
}): Promise<{
  success: boolean;
  error?: string;
  data?: TOutlines[];
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth?.getUser();
  try {
    const { error } = await supabase
      .from('outlines')
      .update({ title })
      .eq('id', id)
      .eq('user_id', user?.id);
    if (error) throw error;
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error updating outline:', error);
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
