export type TFormatOutlineItem = {
  description: string;
  keywords: string[];
};

export type TFormatOutlineInfo = {
  prompt: string;
  keywords: string[];
};

export type TFormatOutlineResponse = {
  info: TFormatOutlineInfo;
  outlines: TFormatOutlineItem[];
};

export type TOutlines = {
  title: string;
  outlines: TFormatOutlineItem[];
  info: TFormatOutlineInfo;
  created_at: string;
  updated_at: string;
  id: string;
  user_id: string;
};
