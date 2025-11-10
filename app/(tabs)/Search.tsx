// /app/(tabs)/search.tsx

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useCoinData } from '../../src/hooks/useCoinData'; 
import { ICoin } from '../../src/types/coinTypes';
import CoinListTile from '../../src/components/CoinListTile'; 
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

// Gradient Colors (Matching the Home Screen's Web3 background)
const GRADIENT_COLORS = ['#100E23', '#000005'] as const; 

// Tab Bar Constants (Ensures list content clears the bottom navigation)
const TAB_BAR_HEIGHT = 85; 
const TAB_BAR_BOTTOM_OFFSET = 0;

const SearchScreen = () => {
  const router = useRouter(); // 🌟 Access the router
  const { coins, filteredCoins, searchTerm, setSearchTerm, toggleFavorite } = useCoinData();

  const listToDisplay = searchTerm.length > 0 ? filteredCoins : coins;

  // 🌟 NEW: Navigation Handler (Same logic as Home Screen)
  const handlePressCoin = useCallback((id: string) => {
    router.push(`/${id}`); 
  }, [router]);

  const renderCoin = ({ item }: { item: ICoin }) => (
    <CoinListTile
        coin={item}
        // 🌟 FIX: Connect the onPress prop to the navigation handler
        onPress={() => handlePressCoin(item.id)} 
        onToggleFavorite={toggleFavorite}
    />
  );

  return (
    <LinearGradient
        colors={GRADIENT_COLORS}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeAreaContent}>
        
        <Text style={styles.title}>Asset Search</Text>
        
        {/* Search Bar at the Top */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search coin by name or symbol..."
          placeholderTextColor="#888"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        
        {/* List of All/Filtered Coins */}
        <FlatList
          data={listToDisplay}
          keyExtractor={(item) => item.id}
          renderItem={renderCoin}
          contentContainerStyle={styles.listContent}
          keyboardDismissMode="on-drag"
          ListEmptyComponent={
            <Text style={styles.emptyText}>
                {searchTerm.length > 0 
                    ? `No assets found for "${searchTerm}"` 
                    : "Start typing to find assets, or scroll through the list."
                }
            </Text>
          }
        />

      </SafeAreaView>
    </LinearGradient>
  );
};

export default SearchScreen;

// --- STYLING ---
const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  safeAreaContent: { flex: 1, backgroundColor: 'transparent', marginTop: 0 },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#FFF', 
    marginHorizontal: 20, 
    marginBottom: 15,
    marginTop: 5,
    fontFamily: 'Inter-Regular'
  },
  searchInput: {
    height: 50,
    backgroundColor: '#0b0b26ff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    color: '#FFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#3A3A5F',
    fontFamily: 'Inter-Light'
  },
  listContent: {
    paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_OFFSET + 20, 
  },
  emptyText: { 
    color: '#888', 
    textAlign: 'center', 
    padding: 20,
    fontSize: 16
  },
});