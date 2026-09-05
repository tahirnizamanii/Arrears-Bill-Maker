/**
 * Utility functions for text processing and cleaning.
 */

/**
 * Strips markdown asterisks (* and **) from draft text and strings,
 * ensuring the content is clean plain text ready for printing on official
 * Government of Sindh stationery, TR-22 proformas, and covering letters.
 */
export function stripMarkdownAsterisks(text: string): string {
  if (!text) return '';
  return text
    // Replace **bold** with inner text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    // Replace *italic* with inner text
    .replace(/\*(.*?)\*/g, '$1')
    // Remove any leftover stray asterisks (e.g., bullet points or formatting markers)
    .replace(/\*/g, '')
    .trim();
}
