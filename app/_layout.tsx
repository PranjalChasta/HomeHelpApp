import { ColorPalette } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Create custom themes based on our color palette
const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: ColorPalette.primary.light,
    background: ColorPalette.background.light.primary,
    card: ColorPalette.background.light.secondary,
    text: ColorPalette.text.light.primary,
    border: '#e5e7eb',
    notification: ColorPalette.accent.error.light,
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: ColorPalette.primary.dark,
    background: ColorPalette.background.dark.primary,
    card: ColorPalette.background.dark.secondary,
    text: ColorPalette.text.dark.primary,
    border: '#374151',
    notification: ColorPalette.accent.error.dark,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    // Add more fonts here if needed
  });

  if (!loaded) {
    return null;
  }

  const theme = colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme;

  return (
    <SafeAreaProvider>
      <ThemeProvider value={theme}>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.card,
              },
              headerTintColor: theme.colors.text,
              headerShadowVisible: false,
              contentStyle: { backgroundColor: theme.colors.background },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="salary" 
              options={{ 
                headerShown: false,
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }} 
            />
            <Stack.Screen 
              name="attendance" 
              options={{ 
                headerShown: false,
                presentation: 'card',
                animation: 'slide_from_right',
              }} 
            />
            <Stack.Screen 
              name="add-helper" 
              options={{ 
                headerShown: false,
                presentation: 'modal',
                animation: 'fade_from_bottom',
              }} 
            />
            <Stack.Screen 
              name="+not-found" 
              options={{
                title: 'Not Found',
                headerShown: true,
              }}
            />
          </Stack>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
