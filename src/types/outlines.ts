interface Chapter {
  title: string;
  description: string;
}

export interface Outline {
  id: string;
  title: string;
  user_id: string;
  chapters: Chapter[];
}