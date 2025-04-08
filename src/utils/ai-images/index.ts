// Trigger Word for the Model
const trigger_word_model = 'AILLUSTRA';

// Improved System Message
const system_message = `You're a Masterpiece Illustrator and you task is Generate a outline black and with white background coloring book illustration that is simple, clear. Prioritize clarity and avoid complex details.`;

const masterConfiguration = `
// STYLE GUIDELINES

- Bold outlines with a minimum of 1.5pt to 2.0pt thickness
- No text or descriptions
- Uniform background color: #FFFFFF (pure white)

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

⊘ Filled colors (filled shapes) -> only outlines
⊘ Floating elements (wheels/leaves/buttons)
⊘ Hybrid features (animal-plant mixes)
⊘ Perspective conflicts (isometric + frontal)
⊘ Limb count errors (3-legged chairs, 3-legged animals, 3-legged humans)
⊘ Seasonal contradictions (snow + blossoms)
⊘ Mechanical impossibilities (handleless cups, heads + feet + body)
⊘ Structural violations (leaning buildings)

// TECHNICAL SPECS
- Line weight: 1.5-2pt uniform thickness
- Negative space: <2% of total composition
- Complexity limit: ≤3 detail layers per object
- White background: #FFFFFF pure hex
- Zero gradients/shadows/textures

// IMPORTANT NOTES
- Ensure all elements are connected and form a coherent structure
- Maintain a consistent visual style throughout the composition
- NO Watermarks/Attribution
- NO Textual Descriptions
- NO AI-generated prompts
- NO Repeating/Redundant Elements
- NO SIGNTURES OR LOGOS
- NO COPYRIGHT NOTICES
- NO TRADEMARKS
`;

// Build the Full Prompt
export const buildFullPrompt = (userPrompt: string, style: string) =>
  `${trigger_word_model}, ${system_message} using this prompt "${userPrompt}" in "${style}" style. 
  Must Following the style guide and rules: "${masterConfiguration}"`;
