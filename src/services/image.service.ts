'use server';

import { headers } from 'next/headers';

type GenerateImageParams = {
  prompt: string;
  style?: string;
  negativePrompt?: string;
  seed?: number;
  steps?: number;
};

type GenerateImageResponse = {
  success: boolean;
  error?: string;
  output: string[];
};

export async function generateImage(params: GenerateImageParams): Promise<GenerateImageResponse> {
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

    return {
      success: data.success,
      output: data.output as string[],
      error: data.error,
    };
  } catch (error) {
    console.error('Error generating image:', error);
    return {
      success: false,
      output: [],
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}