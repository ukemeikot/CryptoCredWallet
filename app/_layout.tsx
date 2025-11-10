import { Stack } from 'expo-router';
// 🌟 FIX: Use the 'contexts' directory name you specified
import { ThemeProvider, useTheme } from '../src/contexts/ThemeContext'; 
import SplashScreen from '../src/components/SplashScreen';
import React, { useEffect } from 'react';
import * as Font from 'expo-font'; 
import * as ExpoSplashScreen from 'expo-splash-screen'; 

// Prevent native splash screen from auto-hiding before asset loading is complete
ExpoSplashScreen.preventAutoHideAsync();

// Component that handles all data/asset loading
function RootContent() {
  // Access the custom theme state, including the persistence readiness flag
  const { isReady: isThemeReady } = useTheme();

  // 1. Load Custom Fonts
  const [fontsLoaded] = Font.useFonts({
    // Load the Inter-Bold font
    'Inter-Regular': require('../assets/fonts/Inter-Regular.otf'),
    'inter-Light': require('../assets/fonts/Inter-Light-BETA.otf'),
  });
  
  // 2. Hide Native Splash Screen when all assets/data are ready
  useEffect(() => {
    if (isThemeReady && fontsLoaded) {
      // Hide the native splash screen after both theme persistence and fonts are ready
      ExpoSplashScreen.hideAsync();
    }
  }, [isThemeReady, fontsLoaded]);


  // 3. Conditional Rendering (Splash or App)
  // Show our custom animated splash screen while waiting for assets and persistence
  if (!isThemeReady || !fontsLoaded) {
    return <SplashScreen />;
  }

  // Once theme and fonts are ready, render the main navigation stack
  return (
    <Stack screenOptions={{ 
        headerShown: false 
    }}>
      {/* Your (tabs) group is rendered here */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> 
      {/* Include the dynamic detail screen in the stack */}
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
}

// The main default export wraps the content in the provider
export default function RootLayout() {
  return (
    // Wrap the entire application stack in the ThemeProvider
    <ThemeProvider>
      <RootContent />
    </ThemeProvider>
  );
}