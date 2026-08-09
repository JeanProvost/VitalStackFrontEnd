import {
  ActivityIndicator,
  Pressable,
  Text,
  useColorScheme,
  type PressableProps,
} from 'react-native';

import { getThemeColors } from '@/constants/theme';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: Variant;
  loading?: boolean;
}

const container: Record<Variant, string> = {
  primary: 'bg-primary dark:bg-dark-primary active:opacity-80',
  secondary:
    'border border-border bg-surface dark:border-dark-border dark:bg-dark-surface active:opacity-80',
  ghost: 'bg-transparent active:opacity-60',
  danger: 'border border-error bg-surface dark:border-error dark:bg-dark-surface active:opacity-80',
};

const text: Record<Variant, string> = {
  primary: 'text-primary-dark',
  secondary: 'text-text dark:text-dark-text',
  ghost: 'text-text-muted dark:text-dark-text-muted',
  danger: 'text-text dark:text-dark-text',
};

export function Button({ label, variant = 'primary', loading, disabled, ...props }: ButtonProps) {
  const isDisabled = disabled || loading;
  const palette = getThemeColors(useColorScheme());
  const indicatorColor =
    variant === 'primary'
      ? palette.primaryForeground
      : variant === 'danger'
        ? palette.error
        : palette.text;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      disabled={isDisabled}
      className={cn(
        'h-12 flex-row items-center justify-center rounded-xl px-four',
        container[variant],
        isDisabled && 'opacity-50',
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={indicatorColor} />
      ) : (
        <Text className={cn('text-base font-semibold', text[variant])}>{label}</Text>
      )}
    </Pressable>
  );
}
