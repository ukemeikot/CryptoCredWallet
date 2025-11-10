import { Stack } from 'expo-router';
import { ThemeProvider, useTheme } from '../src/contexts/ThemeContext'; // 👈 Import Theme Provider and useTheme
import SplashScreen from '../src/components/SplashScreen'; // 👈 Import custom splash component
import React from 'react';

// Component that conditionally renders the content
function RootContent() {
  // Access the theme context state, specifically the isReady flag
  const { isReady } = useTheme();

  // If the theme hasn't loaded yet (i.e., we are still loading persistence), show the splash screen
  if (!isReady) {
    return <SplashScreen />;
  }

  // Once theme is ready, render the main navigation stack
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