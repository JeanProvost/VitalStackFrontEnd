import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { cn } from '@/lib/utils';

interface ScreenProps {
  children: ReactNode;
  /** Wrap content in a ScrollView. Off for screens that own their own scrolling (e.g. FlatList). */
  scroll?: boolean;
  className?: string;
  edges?: readonly Edge[];
}

export function Screen({
  children,
  scroll = false,
  className,
  edges = ['top', 'left', 'right'],
}: ScreenProps) {
  const body = <View className={cn('flex-1 px-four', className)}>{children}</View>;
  return (
    <SafeAreaView edges={edges} className="flex-1 bg-bg dark:bg-bg-dark">
      {scroll ? (
        <ScrollView
          contentContainerClassName="grow px-four"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className={cn('flex-1', className)}>{children}</View>
        </ScrollView>
      ) : (
        body
      )}
    </SafeAreaView>
  );
}
