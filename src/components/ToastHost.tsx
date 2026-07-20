import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cn } from '@/lib/utils';
import { useUIStore, type ToastType } from '@/stores/ui';

const bg: Record<ToastType, string> = {
  error: 'bg-danger',
  success: 'bg-success',
  info: 'bg-brand',
};

/** App-wide toast overlay. Mounted once at the root. */
export function ToastHost() {
  const toasts = useUIStore((s) => s.toasts);
  const dismiss = useUIStore((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <SafeAreaView
      edges={['top']}
      pointerEvents="box-none"
      className="absolute inset-x-0 top-0 z-50 px-four"
    >
      <View className="gap-two pt-two" pointerEvents="box-none">
        {toasts.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => dismiss(t.id)}
            accessibilityRole="alert"
            className={cn('rounded-xl px-four py-three shadow-lg', bg[t.type])}
          >
            <Text className="text-base font-medium text-white">{t.message}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}
