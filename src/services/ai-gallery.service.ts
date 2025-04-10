"use server";

import { createClient } from '@/utils/supabase/server';
import { getPublicUrl } from './supabase-storage.service';

export interface AIGalleryImage {
  id: string;
  name: string;
  url: string;
  created_at: string;
  favorite: boolean;
}

interface ImageListOptions {
  page: number;
  limit: number;
}

/**
 * Fetches a paginated list of AI-generated images from Supabase storage
 */
export const getAIGalleryImages = async ({
  page = 1,
  limit = 8,
}: ImageListOptions): Promise<{
  images: AIGalleryImage[];
  totalCount: number;
}> => {

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const offset = (page - 1) * limit;

  const { data, error } = await supabase.storage
    .from('users-generated-images')
    .list(`${user.id}`, {
      limit: limit,
      offset: offset,
      sortBy: { column: 'created_at', order: 'desc' },
    });
  console.log(data);
  if (error) throw error;

  const images = await Promise.all(
    data.map(async (image) => {
      let imageUrl = await getPublicUrl(image.name);


      return {
        id: image.id,
        name: image.name,
        url: imageUrl,
        created_at: image.created_at,
        favorite: false, // TODO: Implement favorites functionality
      };
    })
  );

  // Get images count from storage by listing all book folders and their contents
  const { data: userImages, error: userImagesError } = await supabase.storage
    .from('users-generated-images')
    .list(`${user?.id}`, {
      limit: 100000,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    });

  if (userImagesError) throw userImagesError;

  return {
    images,
    totalCount: userImages.length || 0,
  };
};

/**
 * Downloads an AI-generated image
 */
export const downloadAIImage = async (imageName: string): Promise<Blob> => {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase.storage
    .from('users-generated-images')
    .download(`${user.id}/${imageName}`);

  if (error) throw error;
  return data;
};

/**
 * Toggles favorite status for an AI-generated image
 */
export const toggleImageFavorite = async (imageId: string, favorite: boolean): Promise<void> => {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('users-generated-images')
    .update({ favorite })
    .eq('id', imageId)
    .eq('user_id', user.id);

  if (error) throw error;
};

/**
 * Deletes an AI-generated image from storage
 */
export const deleteAIImage = async (imageName: string): Promise<void> => {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase.storage
    .from('users-generated-images')
    .remove([`${user.id}/${imageName}`]);

  if (error) throw error;
};