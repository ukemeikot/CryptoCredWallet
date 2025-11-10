export type ThemeMode = 'dark' | 'light';

export interface ColorTheme {
  primary: string;        // Main accent color (e.g., the active blue)
  background: string;     // Main screen background
  card: string;           // Card background (e.g., asset tiles, settings tiles)
  text: string;           // Primary text color (high contrast)
  subtext: string;        // Secondary/placeholder text color
  success: string;        // Green for positive change
  error: string;          // Red for negative change
  border: string;         // Separator lines
}

export const DarkTheme: ColorTheme = {
  primary: '#4A90E2',      // Web3 Accent Blue
  background: '#0A0A1F',   // Deepest background color
  card: '#11173cff',         // List items, Card backgrounds
  text: '#FFFFFF',
  subtext: '#D4D4D4',
  success: '#00FF7F',      // Vibrant Green
  error: '#FF4136',        // Vibrant Red
  border: '#3A3A5F',       // Divider lines
};

export const LightTheme: ColorTheme = {
  primary: '#4A90E2',      // Same accent blue
  background: '#F0F0F5',   // Light gray/off-white background
  card: '#FFFFFF',         // White card backgrounds
  text: '#1C1C1C',         // Dark text color
  subtext: '#666666',      // Gray subtext
  success: '#10A045',      // Standard Green
  error: '#DC3545',        // Standard Red
  border: '#E0E0E0',       // Light divider lines
};

// Export the GRADIENT_COLORS constant for use in the LinearGradient component
export const GRADIENT_COLORS = ['#100E23', '#000005'] as const;