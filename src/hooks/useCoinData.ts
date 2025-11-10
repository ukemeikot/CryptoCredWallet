// /src/hooks/useCoinData.ts

import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchCoinMarkets } from '../api/cryptoService';
import { ICoin } from '../types/coinTypes';
import { ICoinListState, DataStatus } from '../types/hookTypes';
// 🌟 NEW: Import persistence functions for coin data
import { 
  getFavoriteCoinIds, 
  saveFavoriteCoinIds, 
  getLastCoinList, 
  saveCoinList 
} from '../api/favoritesService'; 


const initialState: ICoinListState = {
  status: 'idle' as DataStatus,
  coins: [],
  favorites: [],
  searchTerm: '',
  error: null,
};

export const useCoinData = () => {
  const [state, setState] = useState<ICoinListState>(initialState);
  
  // --- Core Data Fetching ---
  const fetchInitialData = useCallback(async () => {
    
    // Phase 1: Load Persisted Data Immediately
    const localFavoriteIds = await getFavoriteCoinIds();
    const localCoins = await getLastCoinList(); // 👈 Attempt to load cached list
    
    if (localCoins && localCoins.length > 0) {
        // If we have cached data, display it immediately and show status as 'loading' 
        // to indicate that a fresh API check is running in the background.
        const persistedCoins: ICoin[] = localCoins.map(coin => ({
            ...coin,
            isFavorite: localFavoriteIds.includes(coin.id)
        }));
        setState(s => ({
            ...s,
            status: 'loading',
            coins: persistedCoins,
            favorites: localFavoriteIds,
            error: null, // Clear old error message while attempting fetch
        }));
    } else {
        // No local data, show full loading state
        setState(s => ({ ...s, status: 'loading', error: null }));
    }


    try {
      // Phase 2: Attempt Fresh API Call
      const rawCoinMarkets = await fetchCoinMarkets();
      
      // Phase 3: Success! Save new data and update state
      saveCoinList(rawCoinMarkets); // 👈 SAVE successful data

      // Re-fetch favorites just in case the save process was slow, though usually redundant
      const currentFavoriteIds = await getFavoriteCoinIds(); 

      const applicationCoins: ICoin[] = rawCoinMarkets.map(coin => ({
        ...coin,
        isFavorite: currentFavoriteIds.includes(coin.id)
      }));

      setState(s => ({
        ...s,
        status: 'success',
        coins: applicationCoins,
        favorites: currentFavoriteIds,
        error: null,
      }));

    } catch (e: any) {
      // Phase 4: API Failure (401, Offline, Rate Limit, etc.)
      const isOffline = e.message.includes('Network Error');
      
      // 🌟 ELEGANT ERROR MESSAGE:
      let errorMessage = 'Could not fetch current data.';
      if (isOffline) {
          errorMessage = 'Offline Mode: Displaying last known data.';
      } else if (e.response && e.response.status === 401) {
          errorMessage = 'Authentication Failed (401). Displaying cached data.';
      } else if (localCoins && localCoins.length > 0) {
          errorMessage = 'Update failed. Displaying last known data.';
      } else {
          errorMessage = 'Failed to load any data. Please check connection/API key.';
      }

      // If we have NO local coins, the state should reflect a hard error (to show error screen).
      // If we DO have local coins, the state reflects the error, but the coins array is preserved, 
      // preventing a blank screen.
      setState(s => ({ 
        ...s, 
        status: localCoins && localCoins.length > 0 ? 'success' : (isOffline ? 'offline' : 'error'),
        error: errorMessage,
        // If the API failed, 'coins' remain whatever was previously loaded (from Phase 1).
      }));
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);


  // --- Logic for Search Feature (No Change) ---
  const filteredCoins = useMemo(() => {
    const { coins, searchTerm } = state;
    if (!searchTerm) return coins;

    const lowerCaseSearch = searchTerm.toLowerCase();

    return coins.filter(coin => 
      coin.name.toLowerCase().includes(lowerCaseSearch) ||
      coin.symbol.toLowerCase().includes(lowerCaseSearch)
    );
  }, [state.coins, state.searchTerm]);
  
  const setSearchTerm = useCallback((term: string) => {
    setState(s => ({ ...s, searchTerm: term }));
  }, []);


  // --- Logic for Favorites Feature (No Change) ---
  const toggleFavorite = useCallback(async (coinId: string) => {
    setState(s => {
      const isCurrentlyFavorite = s.favorites.includes(coinId);
      const newFavorites = isCurrentlyFavorite
        ? s.favorites.filter(id => id !== coinId)
        : [...s.favorites, coinId];

      const newCoins = s.coins.map(coin =>
        coin.id === coinId ? { ...coin, isFavorite: !isCurrentlyFavorite } : coin
      );

      saveFavoriteCoinIds(newFavorites); 

      return { ...s, coins: newCoins, favorites: newFavorites };
    });
  }, []);
  
  
  // Return the necessary data and functions to the UI component
  return {
    ...state,
    filteredCoins,
    fetchInitialData, 
    setSearchTerm,
    toggleFavorite,
  };
};