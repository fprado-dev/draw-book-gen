import { Outline } from '@/types/outlines';
import { supabase } from './supabase';



export class Outlines {
  private supabase;

  constructor() {
    this.supabase = supabase
  }

  /**
   * Creates a new outline in Supabase
   * @param outline The outline data to create
   * @returns The created outline or error
   */
  async createOutline(outline: Omit<Outline, "id">): Promise<{ success: boolean; error?: string; data?: Outline }> {
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
  async getOutlinesByUserId(userId: string, page: number = 1, limit: number = 6): Promise<{ success: boolean; error?: string; data?: Outline[]; total?: number }> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const offset = (page - 1) * limit;

      const [{ count }, { data }] = await Promise.all([
        this.supabase
          .from('outlines')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId),
        this.supabase
          .from('outlines')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1)
      ]);


      return {
        success: true,
        data: data as Outline[],
        total: count!
      };
    } catch (error) {
      console.error('Error retrieving outlines:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }

  async deleteOutline({ outline_id, user_id }: { outline_id: string, user_id: string }): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('outlines')
        .delete()
        .eq('id', outline_id)
        .eq('user_id', user_id);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting outline:', error);
      return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
  }

}