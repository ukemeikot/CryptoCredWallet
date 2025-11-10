// /src/components/SettingsTile.tsx

import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useTheme } from '../contexts/ThemeContext'; // 👈 Import Theme Hook

interface SettingsTileProps {
  title: string;
  value?: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  isDestructive?: boolean;
}

const SettingsTile: React.FC<SettingsTileProps> = ({ title, value, iconName, onPress, isDestructive = false }) => {
  const { theme } = useTheme(); // 👈 Access the current theme object
  
  // Dynamic colors based on theme
  const dynamicStyles = getDynamicStyles(theme);

  // Text color logic: uses primary text color or theme's error color
  const textColor = isDestructive ? theme.error : theme.text;
  
  return (
    <Pressable onPress={onPress} style={dynamicStyles.container}>
      <Ionicons name={iconName} size={24} color={textColor} style={styles.icon} />
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        {/* Subtext color uses the theme's subtext color */}
        {value && <Text style={[styles.value, { color: theme.subtext }]}>{value}</Text>}
      </View>
      
      {!isDestructive && (
        <Ionicons name="chevron-forward-outline" size={20} color={theme.subtext} />
      )}
    </Pressable>
  );
};

// Function to generate dynamic styles based on the current theme
const getDynamicStyles = (theme: any) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: theme.card, // 👈 Uses theme.card (Dynamically changes)
        borderBottomWidth: 1,
        borderBottomColor: theme.background, // 👈 Uses theme.background for separator
    },
});

// Static styles (independent of theme)
const styles = StyleSheet.create({
  icon: {
    marginRight: 15,
    width: 25,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  // Value color is now set inline in the component, so we remove its hardcoded style here.
  value: {
    fontSize: 14,
  }
});

export default SettingsTile;