import { toast } from 'sonner';

// API key for Stability AI
const STABILITY_API_KEY = process.env.NEXT_PUBLIC_STABILITY_API_KEY || '';
const API_HOST = process.env.NEXT_PUBLIC_API_HOST || '';

// Define types for the API responses and requests
type GenerationResponse = {
  artifacts: Array<{
    base64: string;
    seed: number;
    finishReason: string;
  }>;
};

type GenerationError = {
  message: string;
  name: string;
};

type GenerationOptions = {
  prompt: string;
  stylePrompt?: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  cfgScale?: number;
  steps?: number;
  seed?: number;
  style?: string;
  difficultyLevel?: string;
};

/**
 * Generates a coloring book style image using Stability AI
 */
export async function generateColoringBookImage(
  options: GenerationOptions
): Promise<string | null> {
  try {
    // Map input dimensions to supported SDXL dimensions
    // Supported dimensions: 1024x1024, 1152x896, 1216x832, 1344x768, 1536x640, 640x1536, 768x1344, 832x1216, 896x1152
    let width = options.width || 896;
    let height = options.height || 1152;

    // Ensure we're using supported dimensions
    if (width === 768 && height === 1024) {
      // Portrait mode - closest supported is 896x1152
      width = 896;
      height = 1152;
    } else if (width === 1024 && height === 1024) {
      // Square mode - already supported
      width = 1024;
      height = 1024;
    } else {
      // For any other dimensions, default to 1024x1024
      width = 1024;
      height = 1024;
    }

    // Build the prompt for coloring book style
    let enhancedPrompt = `${options.prompt}`;

    // Add style information if provided
    if (options.stylePrompt) {
      enhancedPrompt += `, ${options.stylePrompt}`;
    }

    // Add coloring book specific styling
    enhancedPrompt += `, Create black and white illustrations, with clean, accurate lines, in the Kawaii style, for coloring pages. Make sure the lines are sharp and smooth, and the bottom is totally white. The illustrations should be detailed, but without color filling, perfect for coloring books. se crisp, uniform black outlines (1.5-2pt weight) on a pure white background (#FFFFFF) with zero color, grayscale, gradients, or shadows.`;

    // Add difficulty level adjustments
    if (options.difficultyLevel) {
      switch (options.difficultyLevel) {
        case 'kids':
          enhancedPrompt += `, very simple outlines, large areas to color, minimal details, suitable for young children`;
          break;
        case 'beginner':
          enhancedPrompt += `, simple outlines, moderate details, suitable for beginners`;
          break;
        case 'intermediate':
          enhancedPrompt += `, detailed outlines, intricate patterns, suitable for intermediate colorists`;
          break;
        case 'advanced':
          enhancedPrompt += `, highly detailed, complex patterns, intricate designs, suitable for advanced colorists`;
          break;
      }
    }

    // Default negative prompt to avoid unwanted elements
    const negativePrompt =
      options.negativePrompt ||
      'color, shading, grayscale, photorealistic, text, signature, watermark, blurry, smudged lines';

    // Prepare the request body
    const body = {
      text_prompts: [
        {
          text: enhancedPrompt,
          weight: 1,
        },
        {
          text: negativePrompt,
          weight: -1,
        },
      ],
      cfg_scale: options.cfgScale || 7,
      height,
      width,
      steps: options.steps || 30,
      samples: 1,
      style_preset: options.style || 'line-art',
    };

    // Make the API request
    const response = await fetch(
      `${API_HOST}/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${STABILITY_API_KEY}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = (await response.json()) as GenerationError;
      throw new Error(
        `Stability AI API Error: ${error.name} - ${error.message}`
      );
    }

    const responseJSON = (await response.json()) as GenerationResponse;
    const image = responseJSON.artifacts[0];

    // Return the base64 image data
    return `data:image/png;base64,${image.base64}`;
  } catch (error) {
    console.error('Error generating image:', error);
    toast.error('Failed to generate image. Please try again.');
    return null;
  }
}
