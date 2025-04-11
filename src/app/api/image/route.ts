import { buildFullPrompt } from '@/utils/ai-images';
import { NextResponse } from 'next/server';
import Replicate from 'replicate';

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.NEXT_PUBLIC_REPLICATE_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, style, aspectRatio } = body;

    const fullPrompt = buildFullPrompt(prompt, style);

    const input = {
      prompt: fullPrompt,
      aspect_ratio: aspectRatio,
      output_format: 'jpg',
      num_outputs: 4,
      lora_scale: 0.8,
    };

    const prediction = await replicate.predictions.create({
      version:
        '6136f7a0938f52e109178509185b6d3a057c121d2e6ab3db327156986c12ea8d',
      input,
    });

    let result = await replicate.predictions.get(prediction.id);
    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      result = await replicate.predictions.get(prediction.id);
    }

    if (result.status === 'failed') {
      throw new Error('Image generation failed');
    }
    // Return the image URL in the response
    // TODO: Add a way to download the image to
    return NextResponse.json({
      output: result.output as string[],
      success: true,
    });
  } catch (error) {
    console.error('Error generating image: ', error);
    return NextResponse.json(
      {
        output: null,
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      },
      { status: 500 }
    );
  }
}
