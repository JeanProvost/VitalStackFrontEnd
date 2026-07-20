import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { CameraScanner } from '@/features/scan/CameraScanner';
import { ScanResultSheet } from '@/features/scan/ScanResultSheet';

export default function ScanScreen() {
  const [focused, setFocused] = useState(false);
  const [scanned, setScanned] = useState<string | null>(null);

  // Pause the camera when the tab loses focus.
  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );

  return (
    <View className="flex-1 bg-black">
      <CameraScanner active={focused && scanned == null} onScan={(gtin14) => setScanned(gtin14)} />
      <ScanResultSheet gtin14={scanned} onClose={() => setScanned(null)} />
    </View>
  );
}
