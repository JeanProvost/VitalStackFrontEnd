import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';

import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: Variant;
  loading?: boolean;
}

const container: Record<Variant, string> = {
  primary: 'bg-brand active:opacity-80',
  secondary: 'bg-surface dark:bg-surface-dark active:opacity-80',
  ghost: 'bg-transparent active:opacity-60',
  danger: 'bg-danger active:opacity-80',
};

const text: Record<Variant, string> = {
  primary: 'text-brand-fg',
  secondary: 'text-fg dark:text-fg-dark',
  ghost: 'text-brand',
  danger: 'text-white',
};

export function Button({ label, variant = 'primary', loading, disabled, ...props }: ButtonProps) {
  const isDisabled = disabled || loading;
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
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? '#fff' : '#208AEF'} />
      ) : (
        <Text className={cn('text-base font-semibold', text[variant])}>{label}</Text>
      )}
    </Pressable>
  );
}
