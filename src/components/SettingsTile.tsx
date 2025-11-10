import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useTheme } from '../contexts/ThemeContext';
interface SettingsTileProps {
  title: string;
  value?: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  isDestructive?: boolean;
}

const SettingsTile: React.FC<SettingsTileProps> = ({ title, value, iconName, onPress, isDestructive = false }) => {
  const { theme } = useTheme();
  
  const dynamicStyles = getDynamicStyles(theme);

  const textColor = isDestructive ? theme.error : theme.text;
  
  return (
    <Pressable onPress={onPress} style={dynamicStyles.container}>
      <Ionicons name={iconName} size={24} color={textColor} style={styles.icon} />
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        {value && <Text style={[styles.value, { color: theme.subtext }]}>{value}</Text>}
      </View>
      
      {!isDestructive && (
        <Ionicons name="chevron-forward-outline" size={20} color={theme.subtext} />
      )}
    </Pressable>
  );
};

const getDynamicStyles = (theme: any) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: theme.card,
        borderBottomWidth: 1,
        borderBottomColor: theme.background,
    },
});
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
    fontFamily: 'Inter-Light'
  },
  value: {
    fontSize: 14,
  }
});

export default SettingsTile;