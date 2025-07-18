/**
 * Modern color system for the HomeHelpApp
 * Using a consistent color palette across light and dark modes
 */

// Primary colors
const primary = {
  light: '#6366f1', // Indigo-500
  dark: '#818cf8',  // Indigo-400
};

// Text colors
const text = {
  light: {
    primary: '#1f2937',   // Gray-800
    secondary: '#4b5563', // Gray-600
    tertiary: '#9ca3af',  // Gray-400
  },
  dark: {
    primary: '#f9fafb',   // Gray-50
    secondary: '#d1d5db', // Gray-300
    tertiary: '#6b7280',  // Gray-500
  }
};

// Background colors
const background = {
  light: {
    primary: '#f9fafb',   // Gray-50
    secondary: '#ffffff', // White
    tertiary: '#f3f4f6',  // Gray-100
  },
  dark: {
    primary: '#111827',   // Gray-900
    secondary: '#1f2937', // Gray-800
    tertiary: '#374151',  // Gray-700
  }
};

// Accent colors
const accent = {
  success: {
    light: '#10b981', // Emerald-500
    dark: '#34d399',  // Emerald-400
  },
  error: {
    light: '#ef4444', // Red-500
    dark: '#f87171',  // Red-400
  },
  warning: {
    light: '#f59e0b', // Amber-500
    dark: '#fbbf24',  // Amber-400
  },
  info: {
    light: '#3b82f6', // Blue-500
    dark: '#60a5fa',  // Blue-400
  }
};

export const Colors = {
  light: {
    text: text.light.primary,
    textSecondary: text.light.secondary,
    textTertiary: text.light.tertiary,
    background: background.light.primary,
    card: background.light.secondary,
    tint: primary.light,
    tabIconDefault: text.light.tertiary,
    tabIconSelected: primary.light,
    success: accent.success.light,
    error: accent.error.light,
    warning: accent.warning.light,
    info: accent.info.light,
    border: '#e5e7eb', // Gray-200
  },
  dark: {
    text: text.dark.primary,
    textSecondary: text.dark.secondary,
    textTertiary: text.dark.tertiary,
    background: background.dark.primary,
    card: background.dark.secondary,
    tint: primary.dark,
    tabIconDefault: text.dark.tertiary,
    tabIconSelected: primary.dark,
    success: accent.success.dark,
    error: accent.error.dark,
    warning: accent.warning.dark,
    info: accent.info.dark,
    border: '#4b5563', // Gray-600
  },
};

// For direct access to the color palette
export const ColorPalette = {
  primary,
  text,
  background,
  accent,
};
