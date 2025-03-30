import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import { generateOutlinePropmpt } from '@/utils/ai-outlines';

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.NEXT_PUBLIC_REPLICATE_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, quantity } = body;

    const enhancedPrompt = generateOutlinePropmpt(prompt, quantity);

    // Generate outline using Replicate
    const output = await replicate.run('anthropic/claude-3.7-sonnet', {
      input: {
        prompt: enhancedPrompt,
        system_prompt: 'You are a creative outline prompt generator.',
        max_tokens_to_sample: 2000, // Adjust as needed
        temperature: 0.7, // Balanced creativity
        top_p: 0.9, // Focused randomness
      },
    });

    return NextResponse.json({
      output,
      success: true,
    });
  } catch (error) {
    console.error('Error generating outline: ', error);
    return NextResponse.json(
      {
        outline: '',
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      },
      { status: 500 }
    );
  }
}
