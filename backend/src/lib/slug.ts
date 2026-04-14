/**
 * Converte una stringa in slug URL-safe:
 * - lowercase
 * - rimuove accenti/diacritici
 * - sostituisce spazi e caratteri non alfanumerici con -
 * - collassa trattini multipli
 */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
