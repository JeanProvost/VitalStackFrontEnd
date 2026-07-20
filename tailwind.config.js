/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'media', // follows system preference
  theme: {
    extend: {
      colors: {
        // Brand + semantic tokens. Referenced as bg-brand, text-fg, etc.
        brand: {
          DEFAULT: '#208AEF',
          fg: '#ffffff',
        },
        bg: {
          DEFAULT: '#ffffff',
          dark: '#000000',
        },
        surface: {
          DEFAULT: '#F0F0F3',
          dark: '#212225',
        },
        fg: {
          DEFAULT: '#000000',
          dark: '#ffffff',
        },
        muted: {
          DEFAULT: '#60646C',
          dark: '#B0B4BA',
        },
        danger: '#E5484D',
        success: '#30A46C',
      },
      spacing: {
        // Mirrors src/constants/theme.ts Spacing scale (in px).
        half: 2,
        one: 4,
        two: 8,
        three: 16,
        four: 24,
        five: 32,
        six: 64,
      },
      fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 22,
        '2xl': 28,
        '3xl': 34,
      },
    },
  },
  plugins: [],
};
