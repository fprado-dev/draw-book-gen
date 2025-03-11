/**
 * Utility functions for handling images in the application
 */

/**
 * Checks if a string is a valid base64 image URL
 * @param url The URL to check
 * @returns boolean indicating if the URL is a base64 image
 */
export function isBase64Image(url: string): boolean {
  return url.startsWith('data:image');
}

/**
 * Ensures an image URL is properly formatted
 * If it's a base64 image, it ensures it has the proper data URL format
 * @param url The image URL or base64 string
 * @returns A properly formatted image URL
 */
export function formatImageUrl(url: string): string {
  if (!url) return '';
  
  // If already a data URL, return as is
  if (isBase64Image(url)) return url;
  
  // If it's a base64 string without the data URL prefix, add it
  if (url.match(/^[A-Za-z0-9+/=]+$/)) {
    return `data:image/png;base64,${url}`;
  }
  
  // Otherwise, it's a regular URL
  return url;
}

/**
 * Gets the dimensions for an image based on its aspect ratio
 * @param aspectRatio The aspect ratio (e.g., 'portrait', 'square')
 * @returns An object with width and height
 */
export function getImageDimensions(aspectRatio: string = 'portrait'): { width: number; height: number } {
  switch (aspectRatio) {
    case 'portrait':
      return { width: 600, height: 800 };
    case 'square':
      return { width: 600, height: 600 };
    default:
      return { width: 600, height: 800 };
  }
}