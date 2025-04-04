'use server';

import { createClient } from '@/utils/supabase/server';

type UpdatePageSequenceParams = {
  pageId: string;
  newSequence: number;
};

export const deletePage = async (pageId: string) => {
  console.log('pageId', pageId);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth?.getUser();

  // Get the page's sequence number and book ID before deletion
  const { data: pageToDelete } = await supabase
    .from('pages')
    .select('sequence_number, book_id')
    .eq('id', pageId)
    .single();

  if (!pageToDelete) throw new Error('Page not found');

  // Delete the page
  const { error: deleteError } = await supabase
    .from('pages')
    .delete()
    .eq('id', pageId)
    .eq('user_id', user?.id);

  if (deleteError) throw deleteError;

  // Get all pages with higher sequence numbers in the same book
  const { data: pagesToUpdate } = await supabase
    .from('pages')
    .select('id, sequence_number')
    .eq('book_id', pageToDelete.book_id)
    .eq('user_id', user?.id)
    .gte('sequence_number', pageToDelete.sequence_number)
    .order('sequence_number');

  if (pagesToUpdate && pagesToUpdate.length > 0) {
    // Update sequence numbers
    const updates = pagesToUpdate.map((page) => ({
      pageId: page.id,
      newSequence: page.sequence_number - 1,
    }));

    await updatePageSequence(updates);
  }
};

export const updatePageSequence = async (updates: UpdatePageSequenceParams[]) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth?.getUser();

  // Use Promise.all to update all pages in parallel
  const updatePromises = updates.map(({ pageId, newSequence }) =>
    supabase
      .from('pages')
      .update({ sequence_number: newSequence })
      .eq('id', pageId)
      .eq('user_id', user?.id)
  );

  await Promise.all(updatePromises);
};