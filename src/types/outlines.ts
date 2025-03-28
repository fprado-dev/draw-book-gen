interface Chapter {
  title: string;
  description: string;
}

export interface Outline {
  id: string;
  title: string;
  chapters: Chapter[];
}
