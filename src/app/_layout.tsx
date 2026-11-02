import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useRef } from 'react';
import { Text, View } from 'react-native';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';

import { Colors, FontFamily } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const hasHiddenSplash = useRef(false);
  const [fontsLoaded, fontError] = useFonts({
    [FontFamily.heading]: Poppins_600SemiBold,
    [FontFamily.body]: Poppins_400Regular,
    [FontFamily.medium]: Poppins_500Medium,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View
        onLayout={() => {
          if (!hasHiddenSplash.current) {
            hasHiddenSplash.current = true;
            SplashScreen.hide();
          }
        }}
        style={{ flex: 1, backgroundColor: colors.background }}>
        {fontError ? (
          <Text style={{ color: colors.text, padding: 24 }}>
            REMMY could not load its fonts. Please restart the app.
          </Text>
        ) : (
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: colors.background,
              },
            }}
          />
        )}
      </View>
    </ThemeProvider>
  );
}
