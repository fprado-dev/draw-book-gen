import { TFormatOutlineResponse } from '@/types/outlines';

export const generateOutlinePropmpt = (prompt: string, count: number) => {
  return `You are a creative outline generator. Your task is to create ${count} unique and engaging outline(s) based on the following theme:
        "${prompt}"

        Task 1:
        - Generate 3 keywords the best describe the theme "${prompt}"
        - Return the keywords as a JSON array of strings
        - Example: ["retro", "vintage", "lounge", "disco"]


        Task 2:
        For each outline, please provide:
        1. A creative and descriptive prompt that captures the essence of the theme "${prompt}"
        2. Three relevant keywords that best represent the content

        examples 
        example prompt "Cozy and Groovy Personages with 2 friends"
        examples outlines:
        {
          description: "Retro Vinyl Lounge with Plush Bean Bags - Two friends flipping through vintage records under a spinning disco ball, surrounded by neon wall art and the warm crackle of a turntable."
          keywords: ["retro", "vintage", "lounge", "disco"]
          
        }
        {
          description: "Enchanted Treehouse with Twinkling Fairy Lights - Friends giggling on a cushioned bench, sipping herbal tea while moonlight filters through bead curtains and ivy-covered walls."
          keywords: ["fairy", "friendly", "moonlight"]
        }

        {
          description: "Psychedelic Tea Den with Floor Cushions - A cozy nook where two friends lounge on embroidered pillows, sampling exotic teas under a ceiling draped in tie-dye fabrics."
          keywords: ["exotic", "nook", "fabrics"]
        }


        For each outline format the response as follows:
        {
          "description": "[Your creative and detailed prompt here]",
          "keywords": ["keyword1", "keyword2", "keyword3"]
        }

        -------
        The Final Response must be in the following format:
        {
          "info": {
            "prompt": "${prompt}",
            "keywords": ["keyword1", "keyword2", "keyword3"]
          },
          outlines: [
                {
                  "description": string,
                  "keywords": ["keyword1", "keyword2", "keyword3"]
                },
                {
                  "description": string,
                  "keywords": ["keyword1", "keyword2", "keyword3"]
                },
          ]
        }

        Guidelines:
        - Make each prompt detailed and vivid
        - Ensure keywords are specific and relevant
        - Max 3 keywords per prompt
        - Avoid generic descriptions
        - Keep prompts between 20-50 words
        - Focus on creating engaging and imaginative content

        Important:
        - Make sure to sendo only the JSON array
        - Do not include any additional text or explanations in your response
        - Ensure the JSON array is well-formed and valid
        - Avoid using any special characters or formatting in the prompts


        Please provide ${count} unique outline(s) following this format, Guidelines and Important Requirements.`;
};

export const formatOutline = (raw: string[]): TFormatOutlineResponse => {
  const cleanedStr = raw
    .join('')
    .replace(/```(json)?/g, '')
    .trim();

  try {
    // Parse the JSON string
    const cleaned = JSON.parse(cleanedStr);
    return cleaned as TFormatOutlineResponse;
  } catch (error) {
    throw new Error(
      `Failed to parse outline JSON: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};
