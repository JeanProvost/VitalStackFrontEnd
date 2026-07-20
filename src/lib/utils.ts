/** Join truthy class names. Small enough not to warrant the `clsx` dependency. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Normalize a scanned barcode (EAN-8/13, UPC-A/E) to a 14-digit GTIN by left-padding
 * with zeros. The API keys products by GTIN-14.
 */
export function toGtin14(barcode: string): string {
  const digits = barcode.replace(/\D/g, '');
  return digits.padStart(14, '0');
}
