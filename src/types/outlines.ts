interface Chapter {
  title: string;
  description: string;
}

export interface Outline {
  title: string;
  user_id: string;
  chapters: Chapter[];
}