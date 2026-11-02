/**
 * REMMY brand tokens and spacing constants.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#F7F7FF',
    background: '#151515',
    backgroundElement: '#2E2E3A',
    backgroundSelected: '#93032E',
    textSecondary: '#4B607F',
    brand: '#93032E',
    brandSecondary: '#27187E',
    cream: '#FEF5E4',
    surface: '#2E2E3A',
    accent: '#990033',
  },
  dark: {
    text: '#F7F7FF',
    background: '#151515',
    backgroundElement: '#2E2E3A',
    backgroundSelected: '#93032E',
    textSecondary: '#4B607F',
    brand: '#93032E',
    brandSecondary: '#27187E',
    cream: '#FEF5E4',
    surface: '#2E2E3A',
    accent: '#990033',
  },
} as const;

export const FontFamily = {
  heading: 'Poppins-SemiBold',
  body: 'Poppins-Regular',
  medium: 'Poppins-Medium',
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
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
