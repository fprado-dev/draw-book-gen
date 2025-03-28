import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import { OutlineFormatter } from '@/services/outline-formatter.service';

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.NEXT_PUBLIC_REPLICATE_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, style, complexity, chapters } = body;

    let enhancedPrompt = `**Role**: You are a *Monochrome Concept Maestro* specializing in black-and-white scenes.
    **Task**:
    generate ${chapters} prompts like this "A cozy yoga studio with plush mats and blankets, creating a tranquil and inviting space for physical and mental well-being. and a breathtaking view."
    examples:
    -Cozy Reading Nook with Soft Pillows
    -Winter Garden with Hanging Plants
    -Breakfast on the Flower-Filled Veranda
    -Vintage Bedroom with Delicate Details

    theme context: "${prompt}}"
    
    **Structure**:  
      - Title
      - Description 
    **Rules**:
      - 18-30 words
      - Zero color references - pure grayscale physics
      - no shadows references


    **Output Format**:  
       1 - [Title]:  
       2 - [Title]: 


    **Base Theme**: ${prompt}.
    `;

    // Add style and complexity modifiers
    if (style) {
      enhancedPrompt += `\nIncorporate a ${style} aesthetic in the descriptions`;
    }

    if (complexity) {
      enhancedPrompt +=
        complexity === 'detailed'
          ? '\nMake the descriptions rich in detail, focusing on textures, colors, and sensory elements'
          : '\nKeep the descriptions concise but evocative';
    }

    let outlineText = '';

    for await (const event of replicate.stream('deepseek-ai/deepseek-r1', {
      input: {
        prompt: enhancedPrompt,
        temperature: 0.7, // Balanced creativity
        top_p: 0.9, // Focused randomness
      },
    })) {
      outlineText += event;
    }

    // Format the outline using the OutlineFormatter service
    const formattedOutline = OutlineFormatter.format(outlineText);
    return NextResponse.json({
      outline: formattedOutline,
      success: true,
    });
  } catch (error) {
    console.error('Error generating outline:', error);
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
