'use server';

import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { saveGeneratedImage } from './supabase-storage.service';

type GenerateImageParams = {
  prompt: string;
  style?: string;
  aspectRatio?: string;
};

type GenerateImageResponse = {
  success: boolean;
  error?: string;
};

export async function generateImage(
  params: GenerateImageParams
): Promise<GenerateImageResponse> {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  try {
    const headersList = await headers();
    const getUrl =
      process.env.NODE_ENV === 'development'
        ? process.env.NEXT_PUBLIC_SITE_URL
        : `https://${headersList.get('x-forwarded-host')}`;

    const response = await fetch(`${getUrl}/api/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    if (data.success) {
      const imagesUrl = data.output as string[];
      imagesUrl.forEach(async (image) => {
        await saveGeneratedImage(image);
      });
    }
    return {
      success: data.success,
      error: data.error,
    };
  } catch (error) {
    console.error('Error generating image:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
