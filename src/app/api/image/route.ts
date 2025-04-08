import { NextResponse } from 'next/server';
import Replicate from 'replicate';

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.NEXT_PUBLIC_REPLICATE_API_KEY || '',
});


const trigger_word_model = "AILLUSTRA";


// Improved System Message
const system_message = `Generate a black and white coloring book illustration that is simple, clear, and child-friendly. Prioritize clarity and avoid complex details.`;


const masterConfiguration = `black and white line-art illustration for coloring books with:
// CORE PRINCIPLES
1. Structural Integrity:
- Complete forms (no partial/cut-off elements)
- Clear ground connection for all standing elements
- 100% containment within frame borders

2. Proportional Elements:
- Vehicles: 4 wheels (cars)/2 wheels (bikes) + geometric bodies
- Animals: 4 legs (quadrupeds)/2 wings (birds)/full fins (fish)
- Flora: 4-8 petals per flower + trunk-canopy connection
- Architecture: 1:3 door-to-building ratio + aligned windows

3. Connection Rules:
- Mandatory attachments (handles/appendages/roots)
- Continuous outlines (no broken lines)
- Consistent perspective (no mixed angles)

// CATEGORY-SPECIFIC MANDATES
• Vehicles:
  - Circular wheels with radial symmetry
  - Rectangular/Trapezoidal body shapes
  - Visible axles connecting wheel pairs

• Nature:
  - Cloud bases flattened with domed tops
  - Tree canopies as symmetrical ovals
  - Flower centers as concentric circles

• Animals:
  - Quadruped leg pairs (front-back mirroring)
  - Bird wing symmetry (mirror image)
  - Fish fin continuity (dorsal-pectral connection)

• Objects:
  - Furniture leg parity (4 legs = 2 front/2 back)
  - Book binding alignment (parallel page lines)
  - Tool integrity (full silhouettes)

• Architecture:
  - Window grid consistency (equal row/column spacing)
  - Roof pitch uniformity (consistent angle)
  - Foundation line weighting (thicker base)

// ERROR PREVENTION
STRICTLY PROHIBIT:
⊘ Floating elements (wheels/leaves/buttons)
⊘ Hybrid features (animal-plant mixes)
⊘ Perspective conflicts (isometric + frontal)
⊘ Limb count errors (3-legged chairs)
⊘ Seasonal contradictions (snow + blossoms)
⊘ Mechanical impossibilities (handleless cups)
⊘ Structural violations (leaning buildings)

// TECHNICAL SPECS
- Line weight: 1.5-2pt uniform thickness
- Negative space: <2% of total composition
- Complexity limit: ≤3 detail layers per object
- White background: #FFFFFF pure hex
- Zero gradients/shadows/textures`;


const buildFullPrompt = (userPrompt: string, style: string) =>
  `${trigger_word_model}, ${system_message}: ${userPrompt} in ${style} style. ${masterConfiguration}
  Artwork must feature bold uniform outlines, easy-to-color distinct sections, and playful simplified forms.`;

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
      lora_scale: 0.8
    };

    const prediction = await replicate.predictions.create({
      model: "aillustra-dev/aillustra-color:6136f7a0938f52e109178509185b6d3a057c121d2e6ab3db327156986c12ea8d",
      input
    });

    let result = await replicate.predictions.get(prediction.id);
    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      result = await replicate.predictions.get(prediction.id);
    }

    if (result.status === 'failed') {
      throw new Error('Image generation failed');
    }
    console.log(result);
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
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      },
      { status: 500 }
    );
  }
}