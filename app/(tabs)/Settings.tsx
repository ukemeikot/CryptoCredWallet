// /app/(tabs)/settings.tsx

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsTile from '../../src/components/SettingsTile'; 
import { useTheme } from '../../src/contexts/ThemeContext';
import { GRADIENT_COLORS } from '../../src/constants/colors';


const SettingsScreen = () => {
  const { theme, mode, toggleTheme } = useTheme();
    
  // --- Data & Resilience Functions ---
  
  const clearLocalCache = useCallback(async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert("Success", "All app data (cache and favorites) has been cleared.");
    } catch (e) {
      Alert.alert("Error", "Failed to clear local cache.");
    }
  }, []);

  const forceFullRefresh = useCallback(() => {
      Alert.alert("Refresh", "Global refresh triggered. Navigate to Home screen to see changes.");
  }, []);

  // 🌟 FIX: Ensure the colors array in the light mode branch is strictly typed (as const).
  const backgroundStyle = mode === 'dark' ? {
    colors: GRADIENT_COLORS, 
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    style: styles.container
  } : {
    // FIX APPLIED HERE: Create a tuple of at least two theme colors and assert 'as const'
    colors: [theme.background, theme.background] as const, 
    style: [styles.container, { backgroundColor: theme.background }]
  };

  return (
    <LinearGradient
        colors={backgroundStyle.colors}
        start={backgroundStyle.start as any} // Assertion kept for safety on start/end objects
        end={backgroundStyle.end as any}
        style={backgroundStyle.style}
    >
      <SafeAreaView style={styles.safeAreaContent}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <Text style={[styles.header, { color: theme.text }]}>Settings</Text>

          {/* 1. General Settings */}
          <Text style={[styles.sectionTitle, { color: theme.subtext }]}>General</Text>
          <View style={styles.sectionContainer}>
            <SettingsTile 
              title="Base Currency" 
              value="USD ($)" 
              iconName="cash-outline" 
              onPress={() => Alert.alert("Currency", "This would open currency selector.")}
            />
            {/* Theme Toggling */}
            <SettingsTile 
              title="Display Theme" 
              value={mode === 'dark' ? "Dark (Web3)" : "Light (Standard)"} 
              iconName={mode === 'dark' ? "sunny-outline" : "moon-outline"}
              onPress={toggleTheme}
            />
          </View>
          
          {/* 2. Data and Resilience */}
          <Text style={[styles.sectionTitle, { color: theme.subtext }]}>Data & Resilience</Text>
          <View style={styles.sectionContainer}>
            <SettingsTile 
              title="Force Refresh Data" 
              value="Reloads all market data"
              iconName="refresh-circle-outline" 
              onPress={forceFullRefresh}
            />
            <SettingsTile 
              title="Clear Local Cache" 
              value="Removes all persistent data"
              iconName="trash-outline" 
              onPress={clearLocalCache}
              isDestructive={true}
            />
          </View>

          {/* 3. About */}
          <Text style={[styles.sectionTitle, { color: theme.subtext }]}>About</Text>
          <View style={styles.sectionContainer}>
            <SettingsTile 
              title="API Source" 
              value="CoinGecko Public API"
              iconName="code-outline" 
              onPress={() => Alert.alert("API", "Data is sourced via CoinGecko Public API.")}
            />
            <SettingsTile 
              title="App Version" 
              value="1.0.0 (HNG Stage 4)" 
              iconName="information-circle-outline" 
              onPress={() => {}}
            />
          </View>


        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1 }, 
  safeAreaContent: { flex: 1, backgroundColor: 'transparent' },
  scrollContent: { paddingBottom: 150 },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  sectionContainer: {
    borderRadius: 15,
    marginHorizontal: 15,
    overflow: 'hidden', 
  }
});