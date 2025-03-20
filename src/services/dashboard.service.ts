import { supabase } from "./supabase";
import * as AuthService from "./auth.service";

export interface UserStats {
  totalProjects: number;
  totalBooks: number;
  totalPages: number;
  totalImages: number;
}

export async function getUserStats(): Promise<UserStats> {
  try {
    const { user } = await AuthService.getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    // Get projects count
    const { count: projectsCount, error: projectsError } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (projectsError) throw projectsError;

    // Get books count
    const { count: booksCount, error: booksError } = await supabase
      .from("books")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (booksError) throw booksError;

    // Get total pages count by summing pages from all books
    const { data: booksData, error: pagesError } = await supabase
      .from("books")
      .select("pages")
      .eq("user_id", user.id);

    if (pagesError) throw pagesError;

    const pagesCount = booksData?.reduce((sum, book) => sum + book.pages.length, 0);
    // Get images count from storage by listing all book folders and their contents
    const { data: userFolders, error: userFoldersError } = await supabase.storage
      .from("users-generated-images")
      .list(`${user.id}`, {
        limit: 100000,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (userFoldersError) throw userFoldersError;
    console.log({ userFolders })
    // Count all images across all book folders
    let totalImagesCount = 0;
    if (userFolders) {
      for (const folder of userFolders) {
        if (folder.name) { // Check if it's a folder
          const { data: bookImages, error: bookImagesError } = await supabase.storage
            .from("users-generated-images")
            .list(`${user.id}/${folder.name}`);

          if (bookImagesError) throw bookImagesError;
          totalImagesCount += bookImages?.length || 0;
        }
      }
    }
    console.log({ totalImagesCount })

    return {
      totalProjects: projectsCount || 0,
      totalBooks: booksCount || 0,
      totalPages: pagesCount || 0,
      totalImages: totalImagesCount,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
}