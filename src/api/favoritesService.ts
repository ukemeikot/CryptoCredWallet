import AsyncStorage from '@react-native-async-storage/async-storage';
import { ICoinMarket, ICoinDetail } from '../types/coinTypes'; // Assuming ICoinDetail is imported

// Key used to store the list of favorited coin IDs
const FAVORITES_KEY = '@CryptoCredWallet:favorites';

// Key used to store the last successful coin list
const COIN_LIST_KEY = '@CryptoCredWallet:coinList';

// Function to generate the unique key for detail storage
const getCoinDetailKey = (coinId: string) => `@CryptoCredWallet:detail:${coinId}`;

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
  }
}

// --------------------------------------------------------
// PERSISTENCE FUNCTIONS FOR COIN LIST
// --------------------------------------------------------

/**
 * Retrieves the last successfully fetched coin list from local storage.
 * @returns A promise that resolves to the coin market array (ICoinMarket[]) or null if not found/error.
 */
export async function getLastCoinList(): Promise<ICoinMarket[] | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(COIN_LIST_KEY);
    // Return the parsed data, typed as ICoinMarket[]
    return jsonValue != null ? JSON.parse(jsonValue) as ICoinMarket[] : null;
  } catch (e) {
    console.error("Error reading coin list from AsyncStorage:", e);
    return null; 
  }
}

/**
 * Saves the latest successful coin list to local storage.
 * @param coinList The ICoinMarket array to save.
 */
export async function saveCoinList(coinList: ICoinMarket[]): Promise<void> {
  try {
    const jsonValue = JSON.stringify(coinList);
    await AsyncStorage.setItem(COIN_LIST_KEY, jsonValue);
  } catch (e) {
    console.error("Error saving coin list to AsyncStorage:", e);
  }
}

// --------------------------------------------------------
// NEW PERSISTENCE FUNCTIONS FOR COIN DETAIL
// --------------------------------------------------------

/**
 * Retrieves the last successfully fetched detail object for a specific coin.
 * @returns A promise that resolves to the ICoinDetail object or null.
 */
export async function getLastCoinDetail(coinId: string): Promise<ICoinDetail | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(getCoinDetailKey(coinId));
    return jsonValue != null ? JSON.parse(jsonValue) as ICoinDetail : null;
  } catch (e) {
    console.error(`Error reading detail for ${coinId}:`, e);
    return null;
  }
}

/**
 * Saves the latest successful detail object for a specific coin.
 * @param details The ICoinDetail object to save.
 */
export async function saveCoinDetail(coinId: string, details: ICoinDetail): Promise<void> {
  try {
    const jsonValue = JSON.stringify(details);
    await AsyncStorage.setItem(getCoinDetailKey(coinId), jsonValue);
  } catch (e) {
    console.error(`Error saving detail for ${coinId}:`, e);
  }
}