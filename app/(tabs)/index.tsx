// /app/(tabs)/index.tsx

import React, { useCallback } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator, Pressable, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router'; 
import { useCoinData } from '../../src/hooks/useCoinData';
import { ICoin } from '../../src/types/coinTypes';
import CoinListTile from '../../src/components/CoinListTile'; 
import BalanceCard from '../../src/components/BalanceCard'; 
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient'; // Imported for background

// Gradient Colors (Dark Navy/Purple to near-Black)
// 🌟 FIX: Use 'as const' to satisfy the strict 'colors' prop requirement
const GRADIENT_COLORS = ['#100E23', '#000005'] as const; 

// Tab Bar Constants (Used for calculating padding to prevent content overlap)
const TAB_BAR_HEIGHT = 85; 
const TAB_BAR_BOTTOM_OFFSET = Platform.OS === 'ios' ? 25 : 0; 


const CoinListScreen = () => {
  const { status, filteredCoins, error, searchTerm, setSearchTerm, toggleFavorite, fetchInitialData } = useCoinData();
  
  const router = useRouter(); 
  
  const handlePressCoin = useCallback((id: string) => {
    // Navigates to the Detail Screen
    router.push(`/${id}`); 
  }, [router]);

  const handleSearchPress = useCallback(() => {
      // Navigates to the Search Tab
      router.push('/Search'); 
  }, [router]);


  const isRefreshing = status === 'loading' || status === 'idle';

  // --- RENDERING STATUS VIEWS (Used for Loading, Error, Offline) ---

  const renderStatusView = (statusText: string, showRetry: boolean) => (
    <LinearGradient
        colors={GRADIENT_COLORS}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientContainer, styles.center]}
    > 
      {status === 'loading' && <ActivityIndicator size="large" color="#00FF7F" />}
      <Text style={styles.statusText}>{statusText}</Text>
      {showRetry && (
        <Pressable onPress={fetchInitialData} style={styles.retryButton}>
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
      )}
    </LinearGradient>
  );

  if (status === 'loading' && filteredCoins.length === 0) {
    return renderStatusView("Fetching live crypto data...", false);
  }
  if (status === 'error' || status === 'offline') {
    return renderStatusView(
      status === 'offline' ? '🚫 Network Issue: Please check your connection.' : `❌ Error: ${error}`,
      true
    );
  }
  
  const renderCoin = ({ item }: { item: ICoin }) => (
    <CoinListTile
      coin={item}
      onPress={() => handlePressCoin(item.id)}
      onToggleFavorite={toggleFavorite}
    />
  );

  // --- SUCCESS State (Main Render) ---

  return (
    <LinearGradient
        colors={GRADIENT_COLORS}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeAreaContent}> 
        
        {/* 1. Custom Top Header (Profile and Actions) */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <Image source={{ uri: 'https://i.pravatar.cc/100?img=1' }} style={styles.avatar} />
          </View>
          <View style={styles.actionIcons}>
            <Pressable onPress={handleSearchPress} style={styles.iconWrapper}>
              <Ionicons name="search-outline" size={24} color="#FFF" />
            </Pressable>
            <Pressable style={styles.iconWrapper}>
              <Ionicons name="notifications-outline" size={24} color="#FFF" />
            </Pressable>
          </View>
        </View>

        <FlatList
          ListHeaderComponent={
            <>
              {/* 2. Balance Card */}
              <BalanceCard />

              {/* Assets List Header */}
              <View style={styles.assetsHeader}>
                <Text style={styles.assetsTitle}>Assets</Text>
                <Pressable style={styles.allChainsButton}>
                  <Text style={styles.allChainsText}>All Chains ⌄</Text>
                </Pressable>
              </View>
            </>
          }
          data={filteredCoins}
          keyExtractor={(item) => item.id}
          renderItem={renderCoin}
          contentContainerStyle={styles.listContent}
          onRefresh={fetchInitialData}
          refreshing={isRefreshing} 
          ListEmptyComponent={
            filteredCoins.length === 0 && searchTerm ? (
              <Text style={styles.emptyText}>No results found for "{searchTerm}"</Text>
            ) : (
              <Text style={styles.emptyText}>No coins available.</Text>
            )
          }
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default CoinListScreen;

// --- STYLING ---
const styles = StyleSheet.create({
  gradientContainer: { flex: 1 }, 
  safeAreaContent: { flex: 1, backgroundColor: 'transparent' }, 
  container: { flex: 1, backgroundColor: 'transparent' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statusText: { color: '#FFF', marginTop: 15, fontSize: 16 },
  retryButton: { backgroundColor: '#00FF7F', padding: 10, borderRadius: 5, marginTop: 15 },
  retryText: { color: '#0A0A1F', fontWeight: 'bold' },
  emptyText: { color: '#FFD700', textAlign: 'center', fontSize: 18, marginVertical: 20 },

  // --- Header Styles ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 12
  },

  // --- Assets List Header Styles ---
  assetsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  assetsTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter-Regular',
  },
  allChainsButton: {
    backgroundColor: '#3A3A5F',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  allChainsText: {
    color: '#4A90E2',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Inter-Light'
  },

  // --- Asset List Content and Padding Fix ---
  listContent: {
    paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_OFFSET + 20,
  },
  iconWrapper: {
        // 1. Define Size and Shape
        width: 44,       // Set width and height to be equal
        height: 44,
        borderRadius: 22, // Half of the width/height makes it a perfect circle
        
        // 2. Center the Icon
        justifyContent: 'center',
        alignItems: 'center',
        
        // 3. Create the Outline/Glow Effect
        borderWidth: 1.5, // Thickness of the circle line
        borderColor: '#4A90E2', // Use your primary accent color
        
        // Optional: Ensure transparent background if needed
        backgroundColor: 'transparent',
    },
});