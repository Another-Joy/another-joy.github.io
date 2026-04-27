import { navigate } from './auth.js';

/**
 * Opens the print preview for the given list ID.
 * The preview page loads all data itself from Supabase + regiment JSON files,
 * exactly like the builder does — no data packing or storage tricks needed.
 */
export function openPdfPreview(listId) {
  const base = window.location.pathname.replace(/\/[^/]*$/, ''); // strip current filename
  const url  = `${base}/print-preview.html?id=${encodeURIComponent(listId)}`;
  window.open(url, '_blank');
}
