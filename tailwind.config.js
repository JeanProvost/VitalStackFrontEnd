/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#F9DB61', dark: '#3D3410' },
        tertiary: { DEFAULT: '#A6D323', dark: '#4A6108' },
        bg: '#FAF8F2',
        surface: '#FFFFFF',
        text: { DEFAULT: '#1C1B16', muted: '#6E6A5E' },
        border: '#E8E4D8',
        error: '#E05B4C',
        warning: '#E8A63D',
        info: '#5B8DB8',
        dark: {
          bg: '#16150F',
          surface: '#221F16',
          primary: '#EFD36A',
          text: '#F2EFE6',
          'text-muted': '#9A958A',
          border: '#343024',
        },
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
