import { createApi } from 'unsplash-js';

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '',
});

export const getThumbnailOptions = async (query: string = 'book cover') => {
  try {
    const result = await unsplashApi.search.getPhotos({
      query,
      perPage: 10,
      orientation: 'landscape',

    });

    if (result.errors) {
      throw new Error('Failed to fetch images from Unsplash');
    }

    return result.response?.results.map((photo) => ({
      url: photo.urls.regular,
      thumb: photo.urls.thumb,
      description: photo.description || photo.alt_description,
      author: photo.user.name,
    })) || [];
  } catch (error) {
    console.error('Error fetching thumbnail options:', error);
    throw error;
  }
};