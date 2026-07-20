import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

import { Button } from '@/components/Button';
import { useBarcodeScanner } from '@/features/scan/useBarcodeScanner';

interface CameraScannerProps {
  active: boolean;
  onScan: (gtin14: string) => void;
}

/** Full-screen camera preview that emits normalized GTIN-14 codes. Handles permission + no-device. */
export function CameraScanner({ active, onScan }: CameraScannerProps) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const codeScanner = useBarcodeScanner(onScan);

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  if (!hasPermission) {
    return (
      <Centered>
        <Text className="mb-four text-center text-base text-white">
          Camera access is needed to scan supplement barcodes.
        </Text>
        <Button label="Grant camera access" onPress={requestPermission} />
      </Centered>
    );
  }

  if (device == null) {
    return (
      <Centered>
        <Text className="text-base text-white">No camera available on this device.</Text>
      </Centered>
    );
  }

  return (
    <View className="flex-1">
      <Camera
        device={device}
        isActive={active}
        codeScanner={codeScanner}
        style={{ flex: 1 }}
      />
      {/* Framing guide */}
      <View pointerEvents="none" className="absolute inset-0 items-center justify-center">
        <View className="h-40 w-72 rounded-2xl border-2 border-white/80" />
        <Text className="mt-four text-sm text-white/90">Point at a supplement barcode</Text>
      </View>
    </View>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <View className="flex-1 items-center justify-center bg-black px-four">{children}</View>;
}
