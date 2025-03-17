import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import { OutlineFormatter } from '@/services/outline-formatter.service';

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.NEXT_PUBLIC_REPLICATE_API_KEY || ''
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, style, complexity, chapters } = body;

    // Generate 5 detailed mandala-themed space descriptions
    let enhancedPrompt = `Generate ${chapters} detailed, atmospheric descriptions of spaces or scenes featuring ${prompt}. Each description should follow this pattern: Max 30 words, [Location] with [Key Feature] and [Atmospheric Details]. 
    Make each description unique and vivid, incorporating elements of lighting, atmosphere, and spatial arrangement. Use this format:
      1 - [First Description]
      2 - [Second Description]
      3 - [Third Description]
      4 - [Fourth Description]
      5 - [Fifth Description]

Base theme: ${prompt}`;

    if (style) {
      enhancedPrompt += `\nIncorporate a ${style} aesthetic in the descriptions`;
    }

    // Set complexity to influence description detail level
    if (complexity) {
      enhancedPrompt += complexity === 'detailed'
        ? '\nMake the descriptions rich in detail, focusing on textures, colors, and sensory elements'
        : '\nKeep the descriptions concise but evocative';
    }

    let outlineText = '';

    // Use DeepSeek AI model with streaming
    for await (const event of replicate.stream(
      "anthropic/claude-3.5-haiku",
      {
        input: {
          prompt: enhancedPrompt,
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 1000
        }
      }
    )) {
      outlineText += event;
    }

    // Format the outline using the OutlineFormatter service
    const formattedOutline = OutlineFormatter.format(outlineText);
    console.log({ formattedOutline })
    return NextResponse.json({
      outline: formattedOutline,
      success: true
    });

  } catch (error) {
    console.error('Error generating outline:', error);
    return NextResponse.json(
      {
        outline: '',
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      },
      { status: 500 }
    );
  }
}