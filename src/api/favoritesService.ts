// /src/api/favoritesService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

// Key used to store the list of favorited coin IDs
const FAVORITES_KEY = '@CryptoCredWallet:favorites';

/**
 * Retrieves the list of favorited coin IDs from local storage.
 * @returns A promise that resolves to an array of coin IDs (strings).
 */
export async function getFavoriteCoinIds(): Promise<string[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
    
    // If data exists, parse it. Otherwise, return an empty array.
    return jsonValue != null ? JSON.parse(jsonValue) as string[] : [];
  } catch (e) {
    console.error("Error reading favorites from AsyncStorage:", e);
    // Return empty array on read error to prevent app crash
    return []; 
  }
}

/**
 * Saves a new list of favorited coin IDs to local storage.
 * @param favoriteIds The array of coin IDs to save.
 */
export async function saveFavoriteCoinIds(favoriteIds: string[]): Promise<void> {
  try {
    const jsonValue = JSON.stringify(favoriteIds);
    await AsyncStorage.setItem(FAVORITES_KEY, jsonValue);
  } catch (e) {
    console.error("Error saving favorites to AsyncStorage:", e);
    // We can proceed without crashing the app, but log the error
  }
}