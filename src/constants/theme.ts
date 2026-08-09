/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform, type ColorSchemeName } from 'react-native';

export const Colors = {
  light: {
    primary: '#F9DB61',
    primaryForeground: '#3D3410',
    tertiary: '#A6D323',
    tertiaryForeground: '#4A6108',
    background: '#FAF8F2',
    surface: '#FFFFFF',
    text: '#1C1B16',
    textMuted: '#6E6A5E',
    border: '#E8E4D8',
    error: '#E05B4C',
    warning: '#E8A63D',
    info: '#5B8DB8',
  },
  dark: {
    primary: '#EFD36A',
    primaryForeground: '#3D3410',
    tertiary: '#A6D323',
    tertiaryForeground: '#4A6108',
    background: '#16150F',
    surface: '#221F16',
    text: '#F2EFE6',
    textMuted: '#9A958A',
    border: '#343024',
    error: '#E05B4C',
    warning: '#E8A63D',
    info: '#5B8DB8',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export function getThemeColors(_colorScheme: ColorSchemeName) {
  return Colors.light;
}

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
