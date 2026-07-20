import { useRef } from 'react';
import { useCodeScanner } from 'react-native-vision-camera';

import { toGtin14 } from '@/lib/utils';

/**
 * Wraps vision-camera's code scanner. Debounces repeat reads of the same code and hands the
 * caller a normalized GTIN-14. Barcode types cover the common retail supplement formats.
 */
export function useBarcodeScanner(onScan: (gtin14: string) => void) {
  const lastValue = useRef<string | null>(null);

  return useCodeScanner({
    codeTypes: ['ean-13', 'ean-8', 'upc-e', 'code-128', 'code-39', 'itf'],
    onCodeScanned: (codes) => {
      const raw = codes[0]?.value;
      if (!raw || raw === lastValue.current) return;
      lastValue.current = raw;
      onScan(toGtin14(raw));
    },
  });
}
