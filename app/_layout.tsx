import '~/global.css';

import { Theme, ThemeProvider, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, View } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from '~/hooks/auth';
import { PortalHost } from '@rn-primitives/portal';
import { Spinner } from '~/components/ui/spinner';
import { ToastProvider } from '~/components/ui/toast-provider';

export {
  ErrorBoundary,
} from 'expo-router';

const queryClient = new QueryClient()

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === 'web') {
      document.documentElement.classList.add('bg-background');
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <Spinner size="lg" />
      </View>
    );
  }

  return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
            <ToastProvider>
              <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
              <SafeAreaView className='flex-1'>
                <Slot />
                <PortalHost />
              </SafeAreaView>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
  );
}

const useIsomorphicLayoutEffect =
Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;