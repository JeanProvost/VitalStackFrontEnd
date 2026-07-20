import { forwardRef } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { cn } from '@/lib/utils';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, className, ...props },
  ref,
) {
  return (
    <View className="gap-two">
      {label ? (
        <Text className="text-sm font-medium text-muted dark:text-muted-dark">{label}</Text>
      ) : null}
      <TextInput
        ref={ref}
        placeholderTextColor="#9CA3AF"
        className={cn(
          'h-12 rounded-xl border px-three text-base text-fg dark:text-fg-dark',
          'border-surface bg-surface dark:border-surface-dark dark:bg-surface-dark',
          error && 'border-danger',
          className,
        )}
        {...props}
      />
      {error ? <Text className="text-xs text-danger">{error}</Text> : null}
    </View>
  );
});
