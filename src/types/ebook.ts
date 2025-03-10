export interface Ebook {
  id: string;
  title: string;
  size: string;
  projectId: string;
  userId: string;
  thumbnailUrl: string;
  created_at: Date;
  updated_at: Date;
  status: 'draft' | 'published';
  pages: {
    id: string;
    content: string;
    pageNumber: number;
  }[];
}

export type EbookSize =
  | '5x8'
  | '5.25x8'
  | '5.5x8.5'
  | '6x9'
  | '7x10'
  | '8x10'
  | '8.5x11';