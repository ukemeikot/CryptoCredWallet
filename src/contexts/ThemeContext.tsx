import React, { createContext, useState, useContext, useEffect, useMemo, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightTheme, DarkTheme, ColorTheme, ThemeMode } from '../constants/colors';

// --- Types ---
interface ThemeContextType {
  theme: ColorTheme;
  mode: ThemeMode;
  toggleTheme: () => void;
  isReady: boolean; // 👈 FIX: Added the missing property
}

// --- Context and Custom Hook ---

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [isReady, setIsReady] = useState(false); // Internal state tracking if persistence is loaded

  const THEME_STORAGE_KEY = '@CryptoCredWallet:themeMode';

  // 1. Load theme preference from AsyncStorage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedMode === 'light' || storedMode === 'dark') {
          setMode(storedMode);
        }
      } catch (e) {
        console.error('Failed to load theme from storage', e);
      } finally {
        setIsReady(true);
      }
    };
    loadTheme();
  }, []);

  // 2. Memoize the current theme object (DarkTheme or LightTheme)
  const theme = useMemo(() => {
    return mode === 'dark' ? DarkTheme : LightTheme;
  }, [mode]);

  // 3. Toggle function with persistence
  const toggleTheme = useCallback(() => {
    setMode(currentMode => {
      const newMode = currentMode === 'dark' ? 'light' : 'dark';
      AsyncStorage.setItem(THEME_STORAGE_KEY, newMode).catch(e => {
        console.error('Failed to save theme to storage', e);
      });
      return newMode;
    });
  }, []);

  // Ensure children are not rendered until the theme is loaded from storage
  if (!isReady) {
    return null; // Or render a loading splash screen if needed
  }

  // Value provided to the rest of the application
  const contextValue = {
    theme,
    mode,
    toggleTheme,
    isReady, // 👈 FIX: Export the state here
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for consuming the theme context easily
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};