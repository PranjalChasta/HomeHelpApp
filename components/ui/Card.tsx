import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import {
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    ViewStyle
} from 'react-native';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'outlined';
  interactive?: boolean;
}

/**
 * A reusable card component that follows the app's design system
 */
export function Card({ 
  children, 
  style, 
  variant = 'default', 
  interactive = false,
  ...rest 
}: CardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Base styles that apply to all variants
  const baseStyles: StyleProp<ViewStyle> = [
    styles.card,
    {
      backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    }
  ];
  
  // Apply variant-specific styles
  switch (variant) {
    case 'elevated':
      baseStyles.push(styles.elevated);
      break;
    case 'outlined':
      baseStyles.push({
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      });
      break;
    default:
      break;
  }
  
  // Apply custom styles passed as props
  baseStyles.push(style);
  
  // If the card is interactive, use TouchableOpacity, otherwise use View
  if (interactive) {
    return (
      <TouchableOpacity
        style={baseStyles}
        activeOpacity={0.7}
        {...rest}
      >
        {children}
      </TouchableOpacity>
    );
  }
  
  return (
    <View style={baseStyles}>
      {children}
    </View>
  );
}

/**
 * Header section of the Card
 */
export function CardHeader({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.header, style]}>
      {children}
    </View>
  );
}

/**
 * Content section of the Card
 */
export function CardContent({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );
}

/**
 * Footer section of the Card
 */
export function CardFooter({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.footer, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  content: {
    padding: 16,
  },
  footer: {
    padding: 16,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}); 