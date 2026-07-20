import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/utils';

export function Card({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn('rounded-2xl bg-surface p-four dark:bg-surface-dark', className)}
      {...props}
    />
  );
}
