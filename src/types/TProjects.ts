export type TNewProject = Omit<TProject, 'id' | 'created_at' | 'last_edited' | 'pages' | "created_at" | "updated_at" | "user_id">
export type TUpdateProject = Partial<TProject>

export type TProject = {
    id: string;
    title: string;
    books_count: number;
    keywords: string[];
    color: string;
    created_at: string;
    updated_at: string;
    user_id: string;
}

