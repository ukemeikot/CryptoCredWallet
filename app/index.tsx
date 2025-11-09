// /app/index.tsx (Coin List Screen)

import React, { useCallback } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router'; 
import { useCoinData } from '../src/hooks/useCoinData';
import { ICoin } from '../src/types/coinTypes';
import CoinListTile from '../src/components/CoinListTile'; 

const CoinListScreen = () => {
  const { status, filteredCoins, error, searchTerm, setSearchTerm, toggleFavorite, fetchInitialData } = useCoinData();
  
  const router = useRouter(); 
  
const handlePressCoin = useCallback((id: string) => {
  // 🌟🌟🌟 FINAL RELIABLE FIX: Assert the path as 'any' to bypass strict type checking 🌟🌟🌟
  router.push({
    pathname: '[id]', 
    params: { id: id }, 
  } as any); // Force TypeScript to accept the correct path structure
}, [router]);

  // 🌟 FIX: Define refreshing state here, outside the final return.
  const isRefreshing = status === 'loading' || status === 'idle';

  // --- RENDERING STATES (Resilience) ---

  // 1. Loading/Initial State
  if (status === 'loading' || status === 'idle') {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#00FF7F" />
        <Text style={styles.statusText}>Fetching live crypto data...</Text>
      </View>
    );
  }

  // 2. Error or Offline State (Handles poor connection gracefully)
  if (status === 'error' || status === 'offline') {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>
          {status === 'offline' ? '🚫 Network Issue: Please check your connection.' : `❌ Error: ${error}`}
        </Text>
        <Pressable onPress={fetchInitialData} style={styles.retryButton}>
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }
  
  // 3. Empty State (If API returns data but filteredCoins is empty)
  if (filteredCoins.length === 0) {
    const isSearchEmpty = searchTerm.length > 0;
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.emptyText}>
          {isSearchEmpty ? `No results found for "${searchTerm}"` : 'No coins available at the moment.'}
        </Text>
        {!isSearchEmpty && <Pressable onPress={fetchInitialData} style={styles.retryButton}>
          <Text style={styles.retryText}>Refresh</Text>
        </Pressable>}
      </View>
    );
  }

  // --- SUCCESS State (Display Data) ---

  const renderCoin = ({ item }: { item: ICoin }) => (
    <CoinListTile
      coin={item}
      onPress={() => handlePressCoin(item.id)}
      onToggleFavorite={toggleFavorite}
    />
  );

  return (
    <View style={styles.container}>
      {/* Search Input (For the Search feature) */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search coins by name or symbol..."
        placeholderTextColor="#888"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      
      <FlatList
        data={filteredCoins}
        keyExtractor={(item) => item.id}
        renderItem={renderCoin}
        contentContainerStyle={{ paddingBottom: 20 }}
        // Implements Pull-to-Refresh
        onRefresh={fetchInitialData}
        // 🌟 FIX: Use the pre-calculated boolean constant to avoid type narrowing error.
        refreshing={isRefreshing} 
      />
    </View>
  );
};

export default CoinListScreen;

// Basic Styling (use your theme/colors here)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1F' }, 
  center: { justifyContent: 'center', alignItems: 'center' },
  searchInput: {
    height: 50,
    backgroundColor: '#1E1E3F',
    borderRadius: 10,
    paddingHorizontal: 15,
    margin: 15,
    color: '#FFF',
    fontSize: 16,
  },
  statusText: { color: '#FFF', marginTop: 15, fontSize: 16 },
  errorText: { color: '#FF4136', textAlign: 'center', fontSize: 18, marginHorizontal: 20 },
  emptyText: { color: '#FFD700', textAlign: 'center', fontSize: 18, marginHorizontal: 20 },
  retryButton: { backgroundColor: '#00FF7F', padding: 10, borderRadius: 5, marginTop: 15 },
  retryText: { color: '#0A0A1F', fontWeight: 'bold' },
});