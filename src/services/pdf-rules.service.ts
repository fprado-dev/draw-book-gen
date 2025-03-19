import { TBook } from '@/types/ebook';

type PaperType = 'white' | 'cream' | 'color';
type TrimSize = '5x8' | '5.25x8' | '5.5x8.5' | '6x9' | '7x10' | '8x10' | '8.5x11';

export interface CoverDimensions {
  coverWidth: number;
  coverHeight: number;
  spineWidth: number;
  bleed: number;
  safeZone: number;
  spineTextAllowed: boolean;
  spineTextMargin: number;
  spineVariance: number;
}

export class PDFRulesService {
  private static readonly BLEED = 0.125; // inches
  private static readonly SAFE_ZONE = 0.25; // inches
  private static readonly MIN_SPINE_TEXT_PAGES = 79;
  private static readonly SPINE_TEXT_MARGIN = 0.0625; // inches
  private static readonly SPINE_VARIANCE = 0.0625; // inches

  private static readonly SPINE_MULTIPLIERS = {
    white: 0.002252,  // inches per page
    cream: 0.0025,    // inches per page
    color: 0.002347   // inches per page
  };

  private static readonly TRIM_SIZES: Record<TrimSize, { width: number; height: number }> = {
    '5x8': { width: 5, height: 8 },
    '5.25x8': { width: 5.25, height: 8 },
    '5.5x8.5': { width: 5.5, height: 8.5 },
    '6x9': { width: 6, height: 9 },
    '7x10': { width: 7, height: 10 },
    '8x10': { width: 8, height: 10 },
    '8.5x11': { width: 8.5, height: 11 }
  };

  static calculateSpineWidth(pageCount: number, paperType: PaperType): number {
    return pageCount * this.SPINE_MULTIPLIERS[paperType];
  }

  static calculateCoverDimensions(book: TBook, paperType: PaperType = 'white'): CoverDimensions {
    const trimSize = book.size as TrimSize || '6x9';
    const dimensions = this.TRIM_SIZES[trimSize];
    const pageCount = book.pages.length || 0;

    const spineWidth = this.calculateSpineWidth(pageCount, paperType);
    const coverWidth = this.BLEED + dimensions.width + spineWidth + dimensions.width + this.BLEED;
    const coverHeight = this.BLEED + dimensions.height + this.BLEED;

    return {
      coverWidth,
      coverHeight,
      spineWidth,
      bleed: this.BLEED,
      safeZone: this.SAFE_ZONE,
      spineTextAllowed: pageCount > this.MIN_SPINE_TEXT_PAGES,
      spineTextMargin: this.SPINE_TEXT_MARGIN,
      spineVariance: this.SPINE_VARIANCE
    };
  }

  static getFormattingRules(): string[] {
    return [
      'Cover should be one continuous image centered left to right on the spine.',
      'Flatten all layers in the native file.',
      `Bleed of ${this.BLEED}" (3.2 mm) is required on all sides.`,
      `Bleed at the bottom of the page cannot exceed ${this.BLEED}" (3.2 mm).`,
      `Any content not intended to be trimmed off should be minimum ${this.SAFE_ZONE}" (6.4 mm) from the outside cover edge.`,
      'Embed all fonts on the cover in the native program before publishing.',
      `Spine text is only allowed for books with more than ${this.MIN_SPINE_TEXT_PAGES} pages.`,
      `Text on spine must have at least ${this.SPINE_TEXT_MARGIN}" (1.6 mm) space between text and spine edge.`,
      `Allow for ${this.SPINE_VARIANCE}" (1.6 mm) variance on either side of the fold lines for your cover.`
    ];
  }
}