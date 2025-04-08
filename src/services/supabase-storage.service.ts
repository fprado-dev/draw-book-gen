'use server';

import { createClient } from '@/utils/supabase/server';

export const getGeneratedImages = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth?.getUser();

  const { data, error } = await supabase.storage
    .from('users-generated-images')
    .list(`${user?.id}`, {
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error) throw error;

  const images = await Promise.all(
    data.map(async (image) => {
      const url = await getPublicUrl(image.name);
      return {
        ...image,
        url,
      };
    })
  );

  return images;
};

export const getPublicUrl = async (path: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth?.getUser();

  const publicUrl = supabase.storage
    .from('users-generated-images')
    .getPublicUrl(`${user?.id}/${path}`).data.publicUrl;

  return publicUrl;
};

export const saveGeneratedImage = async (imageUrl: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth?.getUser();

  if (!user) throw new Error('User not authenticated');

  // Download the image
  const response = await fetch(imageUrl);
  const imageBlob = await response.blob();

  // Generate a unique filename
  const filename = `${Date.now()}.jpg`;
  const filePath = `${user.id}/${filename}`;

  console.log('filePath', filePath);
  console.log('imageBlob', imageBlob);

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('users-generated-images')
    .upload(filePath, imageBlob);

  if (uploadError) throw uploadError;

  // Get the public URL of the uploaded image
  return await getPublicUrl(filename);
};
