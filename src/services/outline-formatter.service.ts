/**
 * Service for formatting book outlines received from DeepSeek API
 */

interface FormattedOutline {
  title: string;
  chapters: Array<{
    title: string;
    description: string;
  }>;
}

export class OutlineFormatter {
  /**
   * Formats the raw outline text from DeepSeek API into a structured format
   * @param rawOutline The raw outline text from the API
   * @returns FormattedOutline
   */
  static format(rawOutline: string): FormattedOutline {
    // Remove common AI thinking patterns and prefixes
    const cleanedOutline = rawOutline
      .replace(
        /^(Let me think about|Let me think|Let me|I'll|Here's|Sure|Okay)[^\n]*\n*/i,
        ''
      )
      .replace(
        /Would you like me to elaborate on any of these descriptions\?/,
        ''
      )
      .trim();

    // Split the outline into lines
    const lines = cleanedOutline.split('\n').filter((line) => line.trim());

    // Extract title (first line)
    const title = lines[0].replace(/^#*\s*/, '').trim();

    // Process scenes
    const scenes: Array<{ number: number; description: string }> = [];
    let currentScene: { number: number; description: string } | null = null;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check if line starts with a number
      const sceneMatch = line.match(/^(\d+)\s*-\s*(.+)/);
      if (sceneMatch) {
        // Save previous scene if exists
        if (currentScene) {
          scenes.push({ ...currentScene });
        }

        // Start new scene
        currentScene = {
          number: parseInt(sceneMatch[1]),
          description: sceneMatch[2].trim(),
        };
      } else if (currentScene && line) {
        // Add to current scene description
        currentScene.description += ' ' + line.trim();
      }
    }

    // Add the last scene
    if (currentScene) {
      scenes.push(currentScene);
    }

    return {
      title,
      chapters: scenes.map((scene) => ({
        title: `Scene ${scene.number}`,
        description: scene.description,
      })),
    };
  }

  /**
   * Converts a formatted outline back to a string representation
   * @param outline The formatted outline object
   * @returns string
   */
  static toString(outline: FormattedOutline): string {
    let result = `# ${outline.title}\n\n`;

    outline.chapters.forEach((chapter, index) => {
      result += `Chapter ${index + 1}: ${chapter.title}\n`;
      result += `${chapter.description}\n\n`;
    });

    return result.trim();
  }
}
