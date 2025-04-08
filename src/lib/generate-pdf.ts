import { TPage } from '@/services/book.service';
import {
  TBook,
  TBookPageDimensionsWithBleed,
  TBookPageDimensionsWithoutBleed,
} from '@/types/ebook';
import jsPDF from 'jspdf';

// Book dimensions constants
const BOOK_DIMENSIONS_WITH_BLEED: TBookPageDimensionsWithBleed = {
  '5x8': {
    inches: { width: 5.125, height: 8.25 },
    cm: { width: 13.01, height: 20.96 },
  },
  '5.25x8': {
    inches: { width: 5.375, height: 8.25 },
    cm: { width: 13.65, height: 20.96 },
  },
  '5.5x8.5': {
    inches: { width: 5.626, height: 8.75 },
    cm: { width: 14.29, height: 22.23 },
  },
  '6x9': {
    inches: { width: 6.125, height: 9.25 },
    cm: { width: 15.56, height: 23.5 },
  },
  '5.06x7.81': {
    inches: { width: 5.185, height: 8.06 },
    cm: { width: 13.17, height: 20.47 },
  },
  '6.14x9.21': {
    inches: { width: 6.265, height: 9.46 },
    cm: { width: 15.9, height: 23.99 },
  },
  '6.69x9.61': {
    inches: { width: 6.815, height: 9.86 },
    cm: { width: 17.29, height: 25 },
  },
  '7x10': {
    inches: { width: 7.125, height: 10.25 },
    cm: { width: 18.08, height: 26 },
  },
  '7.44x9.69': {
    inches: { width: 7.565, height: 9.94 },
    cm: { width: 19.2, height: 25.21 },
  },
  '7.5x9.25': {
    inches: { width: 7.625, height: 9.5 },
    cm: { width: 19.35, height: 24.1 },
  },
  '8x10': {
    inches: { width: 8.125, height: 10.25 },
    cm: { width: 20.52, height: 26 },
  },
  '8.5x11': {
    inches: { width: 8.625, height: 11.25 },
    cm: { width: 21.89, height: 28.54 },
  },
  '8.25x6': {
    inches: { width: 8.375, height: 6.25 },
    cm: { width: 21.26, height: 15.84 },
  },
  '8.25x8.25': {
    inches: { width: 8.375, height: 8.5 },
    cm: { width: 21.26, height: 21.56 },
  },
  '8.27x11.69': {
    inches: { width: 8.395, height: 11.94 },
    cm: { width: 21.3, height: 30.3 },
  },
  '8.5x8.5': {
    inches: { width: 8.625, height: 8.75 },
    cm: { width: 21.91, height: 22.23 },
  },
};

const BOOK_DIMENSIONS_WITHOUT_BLEED: TBookPageDimensionsWithoutBleed = {
  '5x8': {
    inches: { width: 5, height: 8 },
    cm: { width: 12.7, height: 20.32 },
  },
  '5.25x8': {
    inches: { width: 5.25, height: 8 },
    cm: { width: 13.34, height: 20.32 },
  },
  '5.5x8.5': {
    inches: { width: 5.5, height: 8.5 },
    cm: { width: 13.97, height: 21.59 },
  },
  '6x9': {
    inches: { width: 6, height: 9 },
    cm: { width: 15.24, height: 22.86 },
  },
  '5.06x7.81': {
    inches: { width: 5.06, height: 7.81 },
    cm: { width: 12.85, height: 19.84 },
  },
  '6.14x9.21': {
    inches: { width: 6.14, height: 9.21 },
    cm: { width: 15.6, height: 23.39 },
  },
  '6.69x9.61': {
    inches: { width: 6.69, height: 9.61 },
    cm: { width: 16.99, height: 24.4 },
  },
  '7x10': {
    inches: { width: 7, height: 10 },
    cm: { width: 17.78, height: 25.4 },
  },
  '7.44x9.69': {
    inches: { width: 7.44, height: 9.69 },
    cm: { width: 18.9, height: 24.61 },
  },
  '7.5x9.25': {
    inches: { width: 7.5, height: 9.25 },
    cm: { width: 19.05, height: 23.5 },
  },
  '8x10': {
    inches: { width: 8, height: 10 },
    cm: { width: 20.32, height: 25.4 },
  },
  '8.5x11': {
    inches: { width: 8.5, height: 11 },
    cm: { width: 21.59, height: 27.94 },
  },
  '8.25x6': {
    inches: { width: 8.25, height: 6 },
    cm: { width: 20.96, height: 15.24 },
  },
  '8.25x8.25': {
    inches: { width: 8.25, height: 8.25 },
    cm: { width: 20.96, height: 20.96 },
  },
  '8.27x11.69': {
    inches: { width: 8.27, height: 11.69 },
    cm: { width: 21, height: 29.7 },
  },
  '8.5x8.5': {
    inches: { width: 8.5, height: 8.5 },
    cm: { width: 21.59, height: 21.59 },
  },
};

// Function to create and download PDF with correct KDP dimensions
export const handleCreatePDF = async (pages: TPage[], book: TBook) => {
  try {
    if (!book?.size) throw new Error('Book size is required');

    // Get dimensions based on book type (with or without bleed)
    const dimensions =
      book.book_type === 'hardcover'
        ? BOOK_DIMENSIONS_WITH_BLEED[book.size][book.measurement_unit]
        : BOOK_DIMENSIONS_WITHOUT_BLEED[book.size][book.measurement_unit];

    if (!dimensions) throw new Error(`Invalid book size: ${book.size}`);


    // Create PDF with correct dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: book.measurement_unit === 'inches' ? 'in' : 'cm',
      format: [dimensions.width, dimensions.height],
      filters: book.paper_color === 'cream' ? ['ASCIIHexEncode'] : undefined,
    });

    for (let i = 0; i < pages.length; i++) {
      if (i > 0) pdf.addPage();
      const img = pages[i];
      const response = await fetch(img.image_url);
      const blob = await response.blob();
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });

      // Create an image element to get the original dimensions
      const imgElement = document.createElement('img');
      imgElement.src = base64 as string;

      await new Promise<void>((resolve) => {
        imgElement.onload = () => {
          // Get image dimensions and calculate aspect ratio
          const imgAspect = imgElement.width / imgElement.height;
          const pageAspect = dimensions.width / dimensions.height;

          let renderWidth, renderHeight, xOffset, yOffset;
          const marginPercentage = 0.95; // 5% margin

          if (imgAspect > pageAspect) {
            // Image is wider than page proportion
            renderWidth = dimensions.width * marginPercentage;
            renderHeight = (dimensions.width * marginPercentage) / imgAspect;
            xOffset = (dimensions.width * (1 - marginPercentage)) / 2;
            yOffset = (dimensions.height - renderHeight) / 2;
          } else {
            // Image is taller than page proportion
            renderHeight = dimensions.height * marginPercentage;
            renderWidth = dimensions.height * marginPercentage * imgAspect;
            xOffset = (dimensions.width - renderWidth) / 2;
            yOffset = (dimensions.height * (1 - marginPercentage)) / 2;
          }

          // Add image to PDF with proper dimensions and centering
          pdf.addImage(
            base64 as string,
            'PNG',
            xOffset,
            yOffset,
            renderWidth,
            renderHeight
          );
          resolve();
        };
      });
    }

    pdf.save(
      `${book.title}_${book.book_type}_${book.size}_${book.paper_color}.pdf`
    );
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
