/**
 * Enhanced theme color hook that supports our modern color system
 */

import { ColorPalette, Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

// Main hook for getting theme colors from our color system
export function useThemeColor(
  props: { light?: string; dark?: string } = {},
  colorName?: ColorName
) {
  const theme = useColorScheme() ?? 'light';
  
  // If props for this specific theme are provided, use them
  if (props && props[theme]) {
    return props[theme];
  }
  
  // If a color name is provided, return that color from our system
  if (colorName) {
    return Colors[theme][colorName];
  }
  
  // Default to returning the primary tint color
  return Colors[theme].tint;
}

// Helper hooks for common color needs
export function usePrimaryColor() {
  const theme = useColorScheme() ?? 'light';
  return ColorPalette.primary[theme];
}

export function useTextColor(variant: 'primary' | 'secondary' | 'tertiary' = 'primary') {
  const theme = useColorScheme() ?? 'light';
  switch (variant) {
    case 'primary':
      return theme === 'light' ? ColorPalette.text.light.primary : ColorPalette.text.dark.primary;
    case 'secondary':
      return theme === 'light' ? ColorPalette.text.light.secondary : ColorPalette.text.dark.secondary;
    case 'tertiary':
      return theme === 'light' ? ColorPalette.text.light.tertiary : ColorPalette.text.dark.tertiary;
    default:
      return theme === 'light' ? ColorPalette.text.light.primary : ColorPalette.text.dark.primary;
  }
}

export function useBackgroundColor(variant: 'primary' | 'secondary' | 'tertiary' = 'primary') {
  const theme = useColorScheme() ?? 'light';
  switch (variant) {
    case 'primary':
      return theme === 'light' ? ColorPalette.background.light.primary : ColorPalette.background.dark.primary;
    case 'secondary':
      return theme === 'light' ? ColorPalette.background.light.secondary : ColorPalette.background.dark.secondary;
    case 'tertiary':
      return theme === 'light' ? ColorPalette.background.light.tertiary : ColorPalette.background.dark.tertiary;
    default:
      return theme === 'light' ? ColorPalette.background.light.primary : ColorPalette.background.dark.primary;
  }
}

export function useAccentColor(type: 'success' | 'error' | 'warning' | 'info') {
  const theme = useColorScheme() ?? 'light';
  return ColorPalette.accent[type][theme];
}
