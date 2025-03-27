
export interface TBook {
  id: string;
  title: string;
  size: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  last_viewed: Date
  status: TBookStatus;
}


export type TBookStatus = 'draft' | 'published' | 'archived'

export type TBookSize =
  | '5x8'
  | '5.25x8'
  | '5.5x8.5'
  | '6x9'
  | '7x10'
  | '8x10'
  | '8.5x11';