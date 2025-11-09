// /app/[id].tsx (Coin Detail Screen)

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, Dimensions, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; // To get the 'id' parameter
import { LineChart } from 'react-native-chart-kit'; // For the price trend chart
import { useCoinDetails } from '../src/hooks/useCoinDetails';
import { SafeAreaView } from 'react-native-safe-area-context';

// Component for displaying market stats concisely
const StatBox = ({ label, value, isChange = false }: { label: string, value: string | number, isChange?: boolean }) => {
  const color = isChange && typeof value === 'number' 
    ? (value >= 0 ? '#00FF7F' : '#FF4136') 
    : '#FFF';
  
  const formattedValue = isChange && typeof value === 'number'
    ? `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
    : value;

  return (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{formattedValue}</Text>
    </View>
  );
};

const CoinDetailScreen = () => {
  // Get the coin ID from the URL parameter (e.g., bitcoin)
  const { id } = useLocalSearchParams();
  const coinId = Array.isArray(id) ? id[0] : id;

  const { status, details, chartData, error, fetchDetails } = useCoinDetails(coinId as string);
  const screenWidth = Dimensions.get('window').width - 30; // 30px padding

  // Memoize chart data formatting
  const formattedChartData = useMemo(() => {
    if (!chartData || chartData.length === 0) return null;

    // We typically only label the start and end point for clarity
    const prices = chartData.map(p => p[1]);
    const labels = chartData.map(p => p[0]);
    
    // Simplifies labels to show only the first and last date
    const dateLabels = labels.length > 0 
      ? [
          new Date(labels[0]).toLocaleDateString(), 
          new Date(labels[labels.length - 1]).toLocaleDateString()
        ]
      : [];

    return {
      labels: dateLabels,
      datasets: [{ data: prices }],
    };
  }, [chartData]);


  // --- RENDERING STATES (Resilience) ---

  if (status === 'loading' || status === 'idle') {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#00FF7F" />
        <Text style={styles.statusText}>Loading details for {coinId}...</Text>
      </View>
    );
  }

  if (status === 'error' || status === 'offline' || !details) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>
          {status === 'offline' ? '🚫 Network Issue: Please check your connection.' : `❌ Failed to load details.`}
        </Text>
        <Pressable onPress={fetchDetails} style={styles.retryButton}>
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  // --- SUCCESS State ---

  const priceUSD = details.market_data.current_price.usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const priceChange24h = details.market_data.price_change_percentage_24h_in_currency.usd; // Assuming we add this to ICoinDetail

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header: Name and Price */}
        <View style={styles.header}>
          <Image source={{ uri: details.image.large }} style={styles.coinLogo} />
          <Text style={styles.coinName}>{details.name} ({details.symbol.toUpperCase()})</Text>
          <Text style={styles.currentPrice}>{priceUSD}</Text>
          <Text style={[styles.priceChange, { color: priceChange24h >= 0 ? '#00FF7F' : '#FF4136' }]}>
            {priceChange24h >= 0 ? '▲' : '▼'} {priceChange24h.toFixed(2)}% (24h)
          </Text>
        </View>

        {/* Chart (Task Requirement) */}
        <View style={styles.chartContainer}>
          {formattedChartData ? (
            <LineChart
              data={formattedChartData}
              width={screenWidth}
              height={220}
              chartConfig={{
                backgroundColor: '#0A0A1F',
                backgroundGradientFrom: '#0A0A1F',
                backgroundGradientTo: '#0A0A1F',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 255, 127, ${opacity})`, // Web3 Green
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.7})`,
                style: { borderRadius: 16 },
                propsForDots: { r: '0', strokeWidth: '0' },
              }}
              bezier
              withVerticalLines={false}
              withHorizontalLines={false}
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          ) : (
            <Text style={styles.statusText}>Loading chart data...</Text>
          )}
        </View>

        {/* Market Data (Task Requirement: More Information) */}
        <Text style={styles.sectionTitle}>Market Data</Text>
        <View style={styles.statsRow}>
          <StatBox label="24h High" value={details.market_data.high_24h.usd.toFixed(2)} />
          <StatBox label="24h Low" value={details.market_data.low_24h.usd.toFixed(2)} />
          <StatBox label="24h Change" value={priceChange24h} isChange />
        </View>
        
        {/* Description */}
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>
          {details.description.en.length > 500 
            ? details.description.en.substring(0, 500) + '...' // Truncate long descriptions
            : details.description.en || 'No description available.'}
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
};

// ... (Styling below)

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1F' },
  scrollContent: { padding: 15 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statusText: { color: '#FFF', marginTop: 15, fontSize: 16 },
  errorText: { color: '#FF4136', textAlign: 'center', fontSize: 18, marginHorizontal: 20 },
  retryButton: { backgroundColor: '#00FF7F', padding: 10, borderRadius: 5, marginTop: 15 },
  retryText: { color: '#0A0A1F', fontWeight: 'bold' },

  header: { alignItems: 'center', paddingVertical: 20 },
  coinLogo: { width: 40, height: 40, marginBottom: 10 },
  coinName: { color: '#FFF', fontSize: 24, fontWeight: '700' },
  currentPrice: { color: '#FFF', fontSize: 36, fontWeight: 'bold', marginVertical: 8 },
  priceChange: { fontSize: 18, fontWeight: '600' },

  chartContainer: {
    marginVertical: 10,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#0A0A1F', // Match background
  },

  sectionTitle: { color: '#FFF', fontSize: 20, fontWeight: '700', marginTop: 20, marginBottom: 10 },
  
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#1E1E3F',
    borderRadius: 10,
    padding: 10,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: { color: '#AAA', fontSize: 12, marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: '600' },
  
  description: { color: '#CCC', fontSize: 14, lineHeight: 20 },
});

export default CoinDetailScreen;