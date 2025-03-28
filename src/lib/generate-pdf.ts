import { GeneratedImage } from '@/contexts/BookImagesContext';
import { TBook } from '@/types/ebook';
import jsPDF from 'jspdf';

// Function to create and download PDF with correct KDP dimensions
export const handleCreatePDF = async (
  images: GeneratedImage[],
  bookTitle: string,
  book: TBook
) => {
  try {
    // Get book size dimensions in inches
    const bookSizeDimensions: Record<
      string,
      { width: number; height: number }
    > = {
      '5x8': { width: 5, height: 8 },
      '5.25x8': { width: 5.25, height: 8 },
      '5.5x8.5': { width: 5.5, height: 8.5 },
      '6x9': { width: 6, height: 9 },
      '7x10': { width: 7, height: 10 },
      '8x10': { width: 8, height: 10 },
      '8.5x11': { width: 8.5, height: 11 },
    };

    // KDP recommends 300 DPI for print quality
    const DPI = 300;

    // Get dimensions based on book size or default to 6x9 if size not found
    const dimensions = bookSizeDimensions[book?.size || '6x9'];

    // Calculate page dimensions in pixels at 300 DPI
    const pageWidth = Math.round(dimensions.width * DPI);
    const pageHeight = Math.round(dimensions.height * DPI);

    // Create PDF with correct dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [pageWidth, pageHeight],
    });

    const sortedImages = [...images].sort((a, b) => a.order - b.order);

    for (let i = 0; i < sortedImages.length; i++) {
      if (i > 0) pdf.addPage();
      const img = sortedImages[i];
      const response = await fetch(img.url);
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
          // Calculate scaling to fit the page while maintaining aspect ratio
          const imgAspect = imgElement.width / imgElement.height;
          const pageAspect = pageWidth / pageHeight;

          let renderWidth, renderHeight, xOffset, yOffset;

          if (imgAspect > pageAspect) {
            // Image is wider than page proportion
            renderWidth = pageWidth;
            renderHeight = pageWidth / imgAspect;
            xOffset = 0;
            yOffset = (pageHeight - renderHeight) / 2;
          } else {
            // Image is taller than page proportion
            renderHeight = pageHeight;
            renderWidth = pageHeight * imgAspect;
            xOffset = (pageWidth - renderWidth) / 2;
            yOffset = 0;
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

    pdf.save(`${bookTitle}_KDP_${book?.size || '6x9'}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
