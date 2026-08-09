import { forwardRef } from 'react';
import { Text, TextInput, useColorScheme, View, type TextInputProps } from 'react-native';

import { getThemeColors } from '@/constants/theme';
import { cn } from '@/lib/utils';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, className, ...props },
  ref,
) {
  const palette = getThemeColors(useColorScheme());

  return (
    <View className="gap-two">
      {label ? (
        <Text className="text-sm font-medium text-text-muted dark:text-dark-text-muted">
          {label}
        </Text>
      ) : null}
      <TextInput
        ref={ref}
        placeholderTextColor={palette.textMuted}
        selectionColor={palette.primaryForeground}
        className={cn(
          'h-12 rounded-xl border px-three text-base text-text dark:text-dark-text',
          'border-border bg-surface dark:border-dark-border dark:bg-dark-surface',
          error && 'border-error dark:border-error',
          className,
        )}
        {...props}
      />
      {error ? <Text className="text-xs text-error">{error}</Text> : null}
    </View>
  );
});
