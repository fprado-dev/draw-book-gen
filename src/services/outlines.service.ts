import { supabase } from './supabase';

interface Chapter {
  title: string;
  description: string;
}

export interface Outline {
  title: string;
  user_id: string;
  chapters: Chapter[];
}

export class OutlinesService {
  private supabase;

  constructor() {
    this.supabase = supabase
  }

  /**
   * Creates a new outline in Supabase
   * @param outline The outline data to create
   * @returns The created outline or error
   */
  async createOutline(outline: Outline): Promise<{ success: boolean; error?: string; data?: Outline }> {
    try {
      // Validate input
      if (!outline.title || !outline.user_id || !Array.isArray(outline.chapters)) {
        throw new Error('Invalid outline data: Missing required fields');
      }

      if (outline.chapters.length === 0) {
        throw new Error('Invalid outline data: Chapters array cannot be empty');
      }

      // Validate each chapter
      for (const chapter of outline.chapters) {
        if (!chapter.title || !chapter.description) {
          throw new Error('Invalid chapter data: Missing title or description');
        }
      }

      // Insert into Supabase
      const { data, error } = await this.supabase
        .from('outlines')
        .insert([
          {
            title: outline.title,
            user_id: outline.user_id,
            chapters: outline.chapters
          }
        ])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as Outline
      };
    } catch (error) {
      console.error('Error creating outline:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }

  /**
   * Retrieves all outlines for a specific user
   * @param userId The ID of the user
   * @returns Array of outlines or error
   */
  async getOutlinesByUserId(userId: string): Promise<{ success: boolean; error?: string; data?: Outline[] }> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const { data, error } = await this.supabase
        .from('outlines')
        .select('*')
        .eq('user_id', userId).order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data as Outline[]
      };
    } catch (error) {
      console.error('Error retrieving outlines:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }

}