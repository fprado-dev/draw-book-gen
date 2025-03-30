'use server';

import { TFormatOutlineResponse } from '@/types/outlines';
import { formatOutline } from '@/utils/ai-outlines';
import { headers } from 'next/headers';

type TGenerateBookOutline = {
  title: string;
  outlineQuantity: string;
};

type TGenerateBookOutlineResponse = {
  success: boolean;
  error?: Error | string;
  data: TFormatOutlineResponse | null;
};

export const generateOutline = async ({
  title,
  outlineQuantity,
}: TGenerateBookOutline): Promise<TGenerateBookOutlineResponse> => {
  try {
    const headersList = await headers();
    const getUrl =
      process.env.NODE_ENV === 'development'
        ? process.env.NEXT_PUBLIC_SITE_URL
        : `https://${headersList.get('x-forwarded-host')}`;

    const response = await fetch(`${getUrl}/api/outline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: title,
        quantity: outlineQuantity,
      }),
    });

    const data = await response.json();
    const outlines = formatOutline(data.output);

    return {
      success: true,
      data: outlines,
    };
  } catch (error) {
    console.error('Error generating book outline:', error);
    return {
      data: null,
      success: false,
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
};
