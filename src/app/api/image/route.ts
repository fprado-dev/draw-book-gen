import { NextResponse } from 'next/server';
import Replicate from 'replicate';

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.NEXT_PUBLIC_REPLICATE_API_KEY || '',
});

// Task 1 - Improved configurations
// const enhancedConfigurations = `black and white line art, crisp continuous outlines (2-3pt weight), simple interior lines for coloring guidance, high contrast edges, no shading/crosshatching/gradients. Distinct separated elements with breathing space, minimal intricate details, child-friendly complexity. Pure white background (#FFFFFF) with zero grayscale/color. All components must be fully enclosed by outlines.`;

const trigger_word_model = "a_photo_of_coloring_book";

// const enhancedConfigurations = `black and white illustrations, clean and accurate lines, 
// anatomically correct figures with proportional body parts. 
// Strict rules: no extra limbs (exactly 2 arms/legs), no misaligned heads/bodies, 
// no crossed/mismatched eyes. Smooth continuous outlines (1.5-2pt weight), uniform line thickness, 
// complete figures fully contained within frame. Simple expressions with minimal detail, balanced composition with central focus. 
// Pure white background (#FFFFFF), no color/shading/grayscale/gradients. 
// Error prevention: no floating elements, overlapping body parts, or cropped figures`;

// Improved System Message
const system_message = `Generate a black and white coloring book illustration that is simple, clear, and child-friendly. Prioritize clarity and avoid complex details.`;
// const system_message = "You are a professional children's book illustrator creating coloring book pages";
// Task 2 - Optimized prompt construction

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
    const { prompt, style } = body;

    const fullPrompt = buildFullPrompt(prompt, style);

    const input = {
      prompt: fullPrompt,
      aspect_ratio: '2:3',
      output_format: 'jpg',
      num_outputs: 4,
    };

    const prediction = await replicate.predictions.create({
      version: 'e1d236ff01af02678c094f2749673423139d08349d36e260aadecae64e843988',
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