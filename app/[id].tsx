// /app/[id].tsx (Coin Detail Screen - FINAL FIX)

import React, { useMemo } from 'react'; 
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, Dimensions, Image, SafeAreaView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CandlestickChart } from 'react-native-wagmi-charts'; 
import { Ionicons, Feather } from '@expo/vector-icons';
import { useCoinDetails } from '../src/hooks/useCoinDetails'; 
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'; 

// --- CONFIGURATION ---
const GRADIENT_COLORS = ['#100E23', '#000005'] as const; 
const screenWidth = Dimensions.get('window').width; 

const TIME_FRAMES = [
  { label: 'H', days: 1/24 }, 
  { label: 'D', days: 1 }, 
  { label: 'W', days: 7 }, 
  { label: 'M', days: 30 }, 
  { label: '6M', days: 180 }, 
  { label: 'Y', days: 365 }, 
  { label: 'All', days: 1000 }, 
];

// --- COMPONENTS ---

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

const ActionButton = ({ label }: { label: string }) => (
  <View style={styles.actionButtonContainer}>
    <Pressable style={styles.actionButton}>
      <Ionicons 
        name={
          label === 'Send' ? 'arrow-up' : 
          label === 'Receive' ? 'arrow-down' : 
          'swap-horizontal'
        } 
        size={24} 
        color="#FFF" 
      />
    </Pressable>
    <Text style={styles.actionLabel}>{label}</Text>
  </View>
);


const CoinDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const coinId = Array.isArray(id) ? id[0] : id;

  const { status, details, chartData, error, fetchDetails, timeFrame, setTimeFrame } = useCoinDetails(coinId as string);

  const isFetching = status === 'loading'; 
  
  const chartDataWagmi = useMemo(() => {
      return chartData.map(([timestamp, open, high, low, close]) => ({
          timestamp: timestamp,
          open: open,
          high: high,
          low: low,
          close: close,
      }));
  }, [chartData]);


  // --- CHART LOGIC ---
  const renderChart = () => {
    if (chartDataWagmi.length < 2) {
      return <Text style={styles.chartStatusText}>Chart data not available.</Text>;
    }
    
    const candleStyles = {
        increasingColor: "#00FF7F", 
        decreasingColor: "#FF4136"
    } as any;

    return (
      <CandlestickChart.Provider data={chartDataWagmi}>
        <CandlestickChart height={220} width={screenWidth}>
          <CandlestickChart.Candles 
              {...candleStyles} 
          />
        </CandlestickChart>
      </CandlestickChart.Provider>
    );
  };


  // --- RENDERING STATES (Resilience) ---
  const renderErrorState = (statusText: string, showRetry: boolean) => (
    <LinearGradient colors={GRADIENT_COLORS} style={[styles.center, { flex: 1 }]}>
        <Text style={styles.errorText}>❌ {statusText}</Text>
        {showRetry && (
            <Pressable onPress={fetchDetails} style={styles.retryButton}>
                <Text style={styles.retryText}>Retry</Text>
            </Pressable>
        )}
    </LinearGradient>
  );

  if (status === 'loading' && !details) {
    return renderErrorState(`Fetching live data for ${coinId}...`, false);
  }
  if (status === 'error' && !details) {
    return renderErrorState(error || 'Failed to load data.', true);
  }
  if (!details) return renderErrorState("Coin ID not found.", false);

  // --- MAIN RENDER (SUCCESS/CACHED State) ---

  const priceUSD = details.market_data.current_price.usd;
  const priceChange24h = details.market_data.price_change_percentage_24h_in_currency?.usd || 0; 
  const totalHoldingAmount = 44.0258;
  const priceChangeColor = priceChange24h >= 0 ? '#00FF7F' : '#FF4136';

  return (
    <LinearGradient colors={GRADIENT_COLORS} style={styles.container}>
      <RNSafeAreaView style={styles.safeAreaContent}> 
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Header Bar */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.reloadButtonArea}>
              <Ionicons name="arrow-back-outline" size={28} color="#FFF" />
            </Pressable>
            
            <Pressable 
              onPress={fetchDetails} 
              disabled={isFetching}
              style={styles.reloadButtonArea}
            > 
              {isFetching ? (
                <ActivityIndicator size="small" color="#00FF7F" /> 
              ) : (
                <Ionicons name="reload-outline" size={24} color="#FFF" />
              )}
            </Pressable>
          </View>
          
          {/* Status Indicator (for cached data warning) */}
          {(status === 'error' || status === 'offline') && (
              <Text style={styles.cacheWarningText}>{error}</Text>
          )}

          {/* Coin Info and Price (Top Block) */}
          <View style={styles.infoBlock}>
            <View style={styles.coinHeader}>
              <Image source={{ uri: details.image.large }} style={styles.symbolIcon} />
              <Text style={styles.symbolName}>{details.symbol.toUpperCase()}</Text>
            </View>

            <Text style={styles.totalHolding}>{totalHoldingAmount.toFixed(4)} {details.symbol.toUpperCase()}</Text>
            
            <View style={styles.priceRow}>
              <Text style={styles.fiatPrice}>${priceUSD.toLocaleString('en-US')}</Text>
              <Text style={[styles.priceChange, { color: priceChangeColor }]}>
                {priceChange24h >= 0 ? '↑' : '↓'} ${priceChange24h.toFixed(2)} ({priceChange24h.toFixed(2)}%)
              </Text>
            </View>
          </View>

          {/* Action Buttons (Send, Receive, Swap) */}
          <View style={styles.actionRow}>
            {['Send', 'Receive', 'Swap'].map((label) => (
              <ActionButton key={label} label={label} />
            ))}
          </View>

          {/* Chart Section */}
          <View style={styles.chartSection}>
            
            {/* Chart Summary: Only Current Price and 24h Change */}
            <View style={styles.chartSummary}>
              <Text style={styles.chartCurrentPrice}>${priceUSD.toFixed(2)}</Text> 
              <Text style={[styles.chartChange, { color: priceChangeColor }]}>
                  {priceChange24h >= 0 ? '▲' : '▼'} {priceChange24h.toFixed(2)}%
              </Text>
            </View>

            {/* SPACER VIEW to push chart down, preventing overlap with absolute summary */}
            <View style={{ height: 60 }} /> 
            
            {renderChart()}
            
            {/* Time Frame Buttons (Fixed Square Design) */}
            <View style={styles.timeFrameContainer}>
              {TIME_FRAMES.map(frame => (
                <Pressable 
                  key={frame.label}
                  onPress={() => setTimeFrame(frame.days)}
                  style={[
                    styles.timeFrameButton,
                    timeFrame === frame.days && styles.timeFrameActive,
                  ]}
                >
                  <Text style={styles.timeFrameText}>{frame.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          
          {/* Market Data & About Sections */}
          <Text style={styles.sectionTitle}>Market Data</Text>
          <View style={styles.statsRow}>
            <StatBox label="Market Cap" value={`$${(details.market_data.market_cap?.usd || 0).toLocaleString()}`} />
            <StatBox label="Total Volume" value={`$${(details.market_data.total_volume?.usd || 0).toLocaleString()}`} />
          </View>
          <View style={styles.statsRow}>
            <StatBox label="24h High" value={`$${details.market_data.high_24h.usd.toFixed(2)}`} />
            <StatBox label="24h Low" value={`$${details.market_data.low_24h.usd.toFixed(2)}`} />
          </View>
          
          {/* Description/About Section */}
          <Text style={styles.sectionTitle}>About {details.name}</Text>
          <Text style={styles.description}>
            {details.description.en.length > 800 
                ? details.description.en.substring(0, 800) + '...' 
                : details.description.en || 'No description available.'}
          </Text>


        </ScrollView>
      </RNSafeAreaView>
    </LinearGradient>
  );
};

export default CoinDetailScreen;

// --- STYLING ---

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeAreaContent: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  statusText: { color: '#FFF', marginTop: 15, fontSize: 16 },
  errorText: { color: '#FF4136', textAlign: 'center', fontSize: 18, marginHorizontal: 20 },
  retryButton: { backgroundColor: '#4A90E2', padding: 10, borderRadius: 5, marginTop: 15 },
  retryText: { color: '#FFF', fontWeight: 'bold' },
  cacheWarningText: { color: '#FFD700', textAlign: 'center', marginVertical: 10, paddingHorizontal: 20, fontSize: 14 },
  
  // ❌ FIX: The duplicate style declaration for chartStatusText has been removed.
  // The first valid declaration remains.
  chartStatusText: { color: '#CCC', textAlign: 'center', marginVertical: 80 },

  // --- Header & Info Block ---
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, paddingTop: 10, height: 50, alignItems: 'center' },
  reloadButtonArea: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
  infoBlock: { alignItems: 'center', paddingVertical: 15 },
  coinHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  symbolIcon: { width: 24, height: 24, marginRight: 8 },
  symbolName: { color: '#CCC', fontSize: 16 },
  
  totalHolding: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginVertical: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  fiatPrice: { color: '#CCC', fontSize: 16, marginRight: 8 },
  priceChange: { fontSize: 16, fontWeight: '600' },

  // --- Action Row ---
  actionRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 30, marginVertical: 20 },
  actionButtonContainer: { alignItems: 'center' },
  actionButton: { backgroundColor: '#1E1E3F', width: 55, height: 55, borderRadius: 27.5, justifyContent: 'center', alignItems: 'center', marginBottom: 5, borderWidth: 1, borderColor: '#3A3A5F' },
  actionLabel: { color: '#D4D4D4', fontSize: 12 },

  // --- Chart Section ---
  chartSection: { paddingHorizontal: 0, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#1E1E3F' },
  scrollContent: { paddingBottom: 150 }, 
  chartSummary: { position: 'absolute', top: 30, left: 30, zIndex: 10 }, 
  chartCurrentPrice: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  chartChange: { fontSize: 16, fontWeight: '600', marginTop: 4 },

  // --- Time Frame Buttons ---
  timeFrameContainer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#1E1E3F', borderRadius: 8, padding: 5, marginVertical: 10, marginHorizontal: 15 },
  timeFrameButton: { paddingVertical: 10, paddingHorizontal: 0, width: 40, height: 40, borderRadius: 5, justifyContent: 'center', alignItems: 'center' },
  timeFrameActive: { backgroundColor: '#4A90E2' },
  timeFrameText: { color: '#FFF', fontSize: 14, fontWeight: '600' },

  // --- Market Data & About Sections ---
  sectionTitle: { color: '#FFF', fontSize: 20, fontWeight: '700', paddingHorizontal: 15, marginTop: 20, marginBottom: 10 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#1E1E3F',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
  },
  statLabel: { color: '#AAA', fontSize: 12, marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: '600' },
  description: { color: '#CCC', fontSize: 14, lineHeight: 20, paddingHorizontal: 15, marginBottom: 20 },
});