export type TOutline = {
  title: string;
  chapters: Array<{
    title: string;
    description: string;
  }>;
}

type TGenerateBookOutline = {
  prompt: string;
  style?: string;
  complexity?: string;
  chapters: number;
}

export const generateBookOutline = async ({ prompt, chapters }: TGenerateBookOutline): Promise<{ success: boolean; outline?: TOutline; error?: string }> => {
  try {
    // Validate input parameters
    if (!prompt?.trim()) {
      return { success: false, error: 'Prompt is required' };
    }

    if (chapters < 1 || chapters > 10) {
      return { success: false, error: 'Number of chapters must be between 1 and 10' };
    }


    const response = await fetch('/api/outline', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        chapters
      })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to generate outline');
    }

    return {
      success: true,
      outline: data.outline
    };


  } catch (error) {
    console.error('Error generating book outline:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

