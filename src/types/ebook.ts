
export interface TBook {
  id: string;
  title: string;
  size: TBookSize;
  user_id: string;
  book_type: TBookType;
  measurement_unit: TBookMeasurementUnit;
  paper_color: TBookPaperColor;
  status: TBookStatus;
  created_at: Date;
  updated_at: Date;
  last_viewed: Date
}

export type TBookType = 'paperback' | 'hardcover';
export type TBookMeasurementUnit = 'inches' | 'millimeters';
export type TBookStatus = 'draft' | 'published' | 'archived'
export type TBookPaperColor = 'white' | 'cream';

export type TBookSize =
  | '5x8'
  | '5.25x8'
  | '5.5x8.5'
  | '6x9'
  | '5.06x7.81'
  | '6.14x9.21'
  | '6.69x9.61'
  | '7x10'
  | '7.44x9.69'
  | '7.5x9.25'
  | '8x10'
  | '8.5x11'
  | '8.27x11.69'
  | '8.25x6'
  | '8.25x8.25'
  | '8.5x8.5';

export interface TBookPageDimensionsWithoutBleed {
  "5x8": { inches: { width: 5, height: 8 }, cm: { width: 12.7, height: 20.32 } };
  "5.25x8": { inches: { width: 5.25, height: 8 }, cm: { width: 13.34, height: 20.32 } };
  "5.5x8.5": { inches: { width: 5.5, height: 8.5 }, cm: { width: 13.97, height: 21.59 } };
  "6x9": { inches: { width: 6, height: 9 }, cm: { width: 15.24, height: 22.86 } };
  "5.06x7.81": { inches: { width: 5.06, height: 7.81 }, cm: { width: 12.85, height: 19.84 } };
  "6.14x9.21": { inches: { width: 6.14, height: 9.21 }, cm: { width: 15.6, height: 23.39 } };
  "6.69x9.61": { inches: { width: 6.69, height: 9.61 }, cm: { width: 16.99, height: 24.4 } };
  "7x10": { inches: { width: 7, height: 10 }, cm: { width: 17.78, height: 25.4 } };
  "7.44x9.69": { inches: { width: 7.44, height: 9.69 }, cm: { width: 18.9, height: 24.61 } };
  "7.5x9.25": { inches: { width: 7.5, height: 9.25 }, cm: { width: 19.05, height: 23.5 } };
  "8x10": { inches: { width: 8, height: 10 }, cm: { width: 20.32, height: 25.4 } };
  "8.5x11": { inches: { width: 8.5, height: 11 }, cm: { width: 21.59, height: 27.94 } };
  "8.25x6": { inches: { width: 8.25, height: 6 }, cm: { width: 20.96, height: 15.24 } };
  "8.25x8.25": { inches: { width: 8.25, height: 8.25 }, cm: { width: 20.96, height: 20.96 } };
  "8.27x11.69": { inches: { width: 8.27, height: 11.69 }, cm: { width: 21, height: 29.7 } };
  "8.5x8.5": { inches: { width: 8.5, height: 8.5 }, cm: { width: 21.59, height: 21.59 } };
}

export interface TBookPageDimensionsWithBleed {
  "5x8": { inches: { width: 5.125, height: 8.25 }, cm: { width: 13.01, height: 20.96 } };
  "5.25x8": { inches: { width: 5.375, height: 8.25 }, cm: { width: 13.65, height: 20.96 } };
  "5.5x8.5": { inches: { width: 5.626, height: 8.75 }, cm: { width: 14.29, height: 22.23 } };
  "6x9": { inches: { width: 6.125, height: 9.25 }, cm: { width: 15.56, height: 23.50 } };
  "5.06x7.81": { inches: { width: 5.185, height: 8.06 }, cm: { width: 13.17, height: 20.47 } };
  "6.14x9.21": { inches: { width: 6.265, height: 9.46 }, cm: { width: 15.9, height: 23.99 } };
  "6.69x9.61": { inches: { width: 6.815, height: 9.86 }, cm: { width: 17.29, height: 25 } };
  "7x10": { inches: { width: 7.125, height: 10.25 }, cm: { width: 18.08, height: 26 } };
  "7.44x9.69": { inches: { width: 7.565, height: 9.94 }, cm: { width: 19.2, height: 25.21 } };
  "7.5x9.25": { inches: { width: 7.625, height: 9.5 }, cm: { width: 19.35, height: 24.1 } };
  "8x10": { inches: { width: 8.125, height: 10.25 }, cm: { width: 20.52, height: 26 } };
  "8.5x11": { inches: { width: 8.625, height: 11.25 }, cm: { width: 21.89, height: 28.54 } };
  "8.25x6": { inches: { width: 8.375, height: 6.25 }, cm: { width: 21.26, height: 15.84 } };
  "8.25x8.25": { inches: { width: 8.375, height: 8.5 }, cm: { width: 21.26, height: 21.56 } };
  "8.27x11.69": { inches: { width: 8.395, height: 11.94 }, cm: { width: 21.3, height: 30.3 } };
  "8.5x8.5": { inches: { width: 8.625, height: 8.75 }, cm: { width: 21.91, height: 22.23 } };
}

export interface TBookHardcoverPageLimits {
  "5.5x8.5": {
    black_ink_white_paper: { min: 75, max: 550 };
    black_ink_cream_paper: { min: 75, max: 550 };
  };
  "6x9": {
    black_ink_white_paper: { min: 75, max: 550 };
    black_ink_cream_paper: { min: 75, max: 550 };
  };
  "6.14x9.21": {
    black_ink_white_paper: { min: 75, max: 550 };
    black_ink_cream_paper: { min: 75, max: 550 };
  };
  "7x10": {
    black_ink_white_paper: { min: 75, max: 550 };
    black_ink_cream_paper: { min: 75, max: 550 };
  };
  "8.25x11": {
    black_ink_white_paper: { min: 75, max: 550 };
    black_ink_cream_paper: { min: 75, max: 550 };
  };
}

export interface TBookPageLimits {
  "5x8": {
    black_ink_white_paper: { min: 24, max: 828 };
    black_ink_cream_paper: { min: 24, max: 776 };
  };
  "5.06x7.81": {
    black_ink_white_paper: { min: 24, max: 828 };
    black_ink_cream_paper: { min: 24, max: 776 };
  };
  "5.25x8": {
    black_ink_white_paper: { min: 24, max: 828 };
    black_ink_cream_paper: { min: 24, max: 776 };
  };
  "5.5x8.5": {
    black_ink_white_paper: { min: 24, max: 828 };
    black_ink_cream_paper: { min: 24, max: 776 };
  };
  "6x9": {
    black_ink_white_paper: { min: 24, max: 828 };
    black_ink_cream_paper: { min: 24, max: 776 };
  };
  "6.14x9.21": {
    black_ink_white_paper: { min: 24, max: 828 };
    black_ink_cream_paper: { min: 24, max: 776 };
  };
  "6.69x9.61": {
    black_ink_white_paper: { min: 24, max: 828 };
    black_ink_cream_paper: { min: 24, max: 776 };
  };
  "7x10": {
    black_ink_white_paper: { min: 24, max: 828 };
    black_ink_cream_paper: { min: 24, max: 776 };
  };
  "7.44x9.69": {
    black_ink_white_paper: { min: 24, max: 828 };
    black_ink_cream_paper: { min: 24, max: 776 };
  };
  "7.5x9.25": {
    black_ink_white_paper: { min: 24, max: 828 };
    black_ink_cream_paper: { min: 24, max: 776 };
  };
  "8x10": {
    black_ink_white_paper: { min: 24, max: 828 };
    black_ink_cream_paper: { min: 24, max: 776 };
  };
  "8.25x6": {
    black_ink_white_paper: { min: 24, max: 800 };
    black_ink_cream_paper: { min: 24, max: 750 };
  };
  "8.25x8.25": {
    black_ink_white_paper: { min: 24, max: 800 };
    black_ink_cream_paper: { min: 24, max: 750 };
  };
  "8.5x8.5": {
    black_ink_white_paper: { min: 24, max: 590 };
    black_ink_cream_paper: { min: 24, max: 550 };
  };
  "8.5x11": {
    black_ink_white_paper: { min: 24, max: 590 };
    black_ink_cream_paper: { min: 24, max: 550 };
  };
  "8.27x11.69": {
    black_ink_white_paper: { min: 24, max: 780 };
    black_ink_cream_paper: { min: 24, max: 730 };
  };
}
