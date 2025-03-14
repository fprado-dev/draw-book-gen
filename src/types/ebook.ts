export interface TBook {
  id: string;
  title: string;
  size: string;
  project_id: string;
  user_id: string;
  thumbnail_url?: string;
  created_at: Date;
  updated_at: Date;
  last_viewed: Date
  status: TBookStatus;
}

export type TBookStatus = 'draft' | 'published' | 'archived'
export interface TBookCreate {
  title: string;
  size: TBookSize;
  project_id: string;
  thumbnail_url?: string;
  status: TBookStatus;
}

export type TBookSize =
  | '5x8'
  | '5.25x8'
  | '5.5x8.5'
  | '6x9'
  | '7x10'
  | '8x10'
  | '8.5x11';