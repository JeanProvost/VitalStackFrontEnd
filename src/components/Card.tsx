import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/utils';

export function Card({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        'rounded-2xl border border-border bg-surface p-four dark:border-dark-border dark:bg-dark-surface',
        className,
      )}
      {...props}
    />
  );
}
