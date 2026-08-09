import '@/global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { DefaultTheme, Stack, ThemeProvider, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from '@/api/queryClient';
import { ToastHost } from '@/components/ToastHost';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/stores/auth';

SplashScreen.preventAutoHideAsync();

/** Redirects between the (auth) and (tabs) groups based on session state. */
function useProtectedRoute() {
  const status = useAuthStore((s) => s.status);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    const inAuthGroup = segments[0] === '(auth)';
    if (status === 'unauthenticated' && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (status === 'authenticated' && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [status, segments, router]);
}

export default function RootLayout() {
  const palette = Colors.light;
  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: palette.primaryForeground,
      background: palette.background,
      card: palette.surface,
      text: palette.text,
      border: palette.border,
      notification: palette.error,
    },
  };
  const status = useAuthStore((s) => s.status);
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (status !== 'loading') SplashScreen.hideAsync();
  }, [status]);

  useProtectedRoute();

  if (status === 'loading') return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={navigationTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="supplement/[id]"
                options={{ presentation: 'modal', headerShown: true, title: 'Supplement' }}
              />
            </Stack>
            <ToastHost />
            <StatusBar style="dark" />
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
