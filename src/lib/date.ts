/**
 * Formats a date string or Date object to DD/MM/YYYY format using Intl.DateTimeFormat
 * @param date - Date string or Date object to format
 * @returns Formatted date string in DD/MM/YYYY format
 */
export function formatDate(date: string | Date): string {
  if (!date) return '';

  const dateObject = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObject);
}