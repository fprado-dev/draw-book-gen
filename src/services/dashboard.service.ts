"use server"

import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";

export interface UserStats {
  totalProjects: number;
  totalBooks: number;
  totalImages: number;
}

export interface DailyImageStats {
  date: string;
  images: number;
}

export interface DailyOutlinesStats {
  date: string;
  outlines: number;
}



export async function getUserStats(): Promise<UserStats> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth?.getUser()
  try {
    // Get projects count
    const { count: projectsCount, error: projectsError } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user?.id);

    if (projectsError) throw projectsError;

    // Get books count
    const { count: booksCount, error: booksError } = await supabase
      .from("books")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user?.id);

    if (booksError) throw booksError;



    // Get images count from storage by listing all book folders and their contents
    const { data: userFolders, error: userFoldersError } = await supabase.storage
      .from("users-generated-images")
      .list(`${user?.id}`, {
        limit: 100000,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (userFoldersError) throw userFoldersError;
    // Count all images across all book folders
    let totalImagesCount = 0;
    if (userFolders) {
      for (const folder of userFolders) {
        if (folder.name) { // Check if it's a folder
          const { data: bookImages, error: bookImagesError } = await supabase.storage
            .from("users-generated-images")
            .list(`${user?.id}/${folder.name}`);

          if (bookImagesError) throw bookImagesError;
          totalImagesCount += bookImages?.length || 0;
        }
      }
    }

    return {
      totalProjects: projectsCount || 0,
      totalBooks: booksCount || 0,
      totalImages: totalImagesCount || 0,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
}

export async function getDailyImageStats({ user }: { user: User | null }): Promise<DailyImageStats[]> {
  const supabase = await createClient()
  try {

    const { data: userFolders, error: userFoldersError } = await supabase.storage
      .from("users-generated-images")
      .list(`${user?.id}`, {
        limit: 100000,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (userFoldersError) throw userFoldersError;

    // Store image counts by date
    const imagesByDate = new Map<string, number>();

    if (userFolders) {
      for (const folder of userFolders) {
        if (folder.name) {
          const { data: bookImages, error: bookImagesError } = await supabase.storage
            .from("users-generated-images")
            .list(`${user?.id}/${folder.name}`);

          if (bookImagesError) throw bookImagesError;

          // Group images by date
          bookImages?.forEach(image => {
            const date = new Date(image.created_at).toISOString().split('T')[0];
            imagesByDate.set(date, (imagesByDate.get(date) || 0) + 1);
          });
        }
      }
    }

    // Convert map to array and sort by date
    const stats = Array.from(imagesByDate.entries())
      .map(([date, images]) => ({ date, images }))
      .sort((a, b) => a.date.localeCompare(b.date));
    return stats;
  } catch (error) {
    console.error("Error fetching daily image stats:", error);
    throw error;
  }
}

export async function getDailyOutlineStats({ user }: { user: User | null }): Promise<DailyOutlinesStats[]> {
  const supabase = await createClient()

  try {


    const { data: outlines, error } = await supabase
      .from("outlines")
      .select("created_at")
      .eq("user_id", user?.id);

    if (error) throw error;

    // Store outline counts by date
    const outlinesByDate = new Map<string, number>();

    // Group outlines by date
    outlines?.forEach(outline => {
      const date = new Date(outline.created_at).toISOString().split('T')[0];
      outlinesByDate.set(date, (outlinesByDate.get(date) || 0) + 1);
    });

    // Convert map to array and sort by date
    const stats = Array.from(outlinesByDate.entries())
      .map(([date, outlines]) => ({ date, outlines }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return stats;
  } catch (error) {
    console.error("Error fetching daily outline stats:", error);
    throw error;
  }
}

