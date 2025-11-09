// /src/hooks/useCoinData.ts

import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchCoinMarkets } from '../api/cryptoService';
import { ICoin } from '../types/coinTypes';
import { ICoinListState, DataStatus } from '../types/hookTypes';
import { getFavoriteCoinIds, saveFavoriteCoinIds } from '../api/favoritesService'; 



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
    setState(s => ({ ...s, status: 'loading', error: null }));
    try {
      // 1. Fetch Favorites and Coin List in parallel for efficiency
      const [favoriteIds, rawCoinMarkets] = await Promise.all([
        // 🌟 Use the real service function
        getFavoriteCoinIds(), 
        fetchCoinMarkets()
      ]);

      // 2. Map raw data to application-specific ICoin model
      const applicationCoins: ICoin[] = rawCoinMarkets.map(coin => ({
        ...coin,
        isFavorite: favoriteIds.includes(coin.id) // Attach favorite status
      }));

      setState(s => ({
        ...s,
        status: 'success',
        coins: applicationCoins,
        favorites: favoriteIds,
      }));

    } catch (e: any) {
      // 3. Handle Error and Offline States (Resilience)
      // Note: A more robust check for offline status (e.g., using NetInfo)
      // is recommended, but this Axios check works for a basic start.
      const isOffline = e.message.includes('Network Error'); 
      setState(s => ({ 
        ...s, 
        status: isOffline ? 'offline' : 'error', 
        error: isOffline ? 'You appear to be offline.' : (e.message || 'An unknown error occurred.')
      }));
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);


  // --- Logic for Search Feature ---
  const filteredCoins = useMemo(() => {
    const { coins, searchTerm } = state;
    if (!searchTerm) return coins;

    const lowerCaseSearch = searchTerm.toLowerCase();

    // Search is performed against name and symbol
    return coins.filter(coin => 
      coin.name.toLowerCase().includes(lowerCaseSearch) ||
      coin.symbol.toLowerCase().includes(lowerCaseSearch)
    );
  }, [state.coins, state.searchTerm]);
  
  // Expose function to update the search term from the UI
  const setSearchTerm = useCallback((term: string) => {
    setState(s => ({ ...s, searchTerm: term }));
  }, []);


  // --- Logic for Favorites Feature ---
  const toggleFavorite = useCallback(async (coinId: string) => {
    // 1. Optimistically update UI state
    setState(s => {
      const isCurrentlyFavorite = s.favorites.includes(coinId);
      const newFavorites = isCurrentlyFavorite
        ? s.favorites.filter(id => id !== coinId)
        : [...s.favorites, coinId];

      const newCoins = s.coins.map(coin =>
        coin.id === coinId ? { ...coin, isFavorite: !isCurrentlyFavorite } : coin
      );

      // 2. Persist the new favorite list to local storage
      // 🌟 Use the real service function (note: it's an async call)
      // We don't await here to prevent blocking the UI render, relying on 
      // the `setState` for immediate visual update (optimistic update).
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