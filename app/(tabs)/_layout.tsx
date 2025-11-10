// /app/(tabs)/_layout.tsx

import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, Platform } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons'; 

// Define colors to match the design's dark mode and accent
const ACCENT_COLOR = '#4A90E2'; // A vibrant blue for active state
const BACKGROUND_COLOR = '#070511'; // Deep dark background

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Hide the default header since the design uses a custom screen header
        headerShown: false,
        // Set the active icon color to the vibrant blue
        tabBarActiveTintColor: ACCENT_COLOR,
        // General style applied to the entire tab bar container
        tabBarStyle: {
          ...styles.customTabBar,
          backgroundColor: BACKGROUND_COLOR, 
        },
        // Inactive tab icon color
        tabBarInactiveTintColor: '#888',
        // Hide the text labels to match the design (only icons)
        tabBarShowLabel: false,
      }}
    >
      {/* --- Home Tab --- */}
      <Tabs.Screen
        name="index" // Corresponds to /app/(tabs)/index.tsx
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            // Use the Home icon from Ionicons
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      
      {/* --- Search Tab --- */}
      <Tabs.Screen
        name="Search" // Corresponds to /app/(tabs)/search.tsx
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            // Use the Search icon
            <Feather name="search" size={24} color={color} />
          ),
        }}
      />

      {/* --- Settings Tab --- */}
      <Tabs.Screen
        name="Settings" // Corresponds to /app/(tabs)/settings.tsx
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            // Use the Settings/Menu icon
            <Feather name="settings" size={24} color={color} />
          ),
        }}
      />
      
      {/* ⚠️ Hide the Detail screen route from the tabs */}
      <Tabs.Screen 
        name="[id]" 
        options={{ href: null }} 
      />
      
    </Tabs>
  );
}

const styles = StyleSheet.create({
  customTabBar: {
    // 🌟 Key styles for the floating, rounded effect 🌟
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 25 : 0, // Lower on Android for consistency
    left: 20,
    right: 20,
    height: 85,
    borderRadius: 0, // Large border radius for rounded edges
    borderTopWidth: 0, // Remove the default ugly border line
    
    // Shadow for depth (floating effect)
    shadowColor: '#04040aff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5, // Android shadow
  },
});