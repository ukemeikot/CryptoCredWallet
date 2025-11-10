// /src/components/CoinListTile.tsx

import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { ICoin } from '../types/coinTypes'; 

// --- MOCK DATA ASSUMPTION ---
// Since the API only gives current_price, we use a mock holding amount (e.g., 4.0258 BTC)
// to display the final calculated value, as seen in the design.
const MOCK_HOLDING_AMOUNT = 4.0258;

interface CoinListTileProps {
  coin: ICoin;
  onPress: () => void;
  onToggleFavorite: (id: string) => void; 
}

const CoinListTile: React.FC<CoinListTileProps> = ({ coin, onPress, onToggleFavorite }) => {
  
  // Safety checks (runtime crash resilience)
  const priceChange = coin.price_change_percentage_24h;
  const isPriceChangeValid = typeof priceChange === 'number';

  const changeColor = isPriceChangeValid && priceChange < 0 ? '#FF4136' : '#00FF7F'; // Red for down, Green for up
  const changeText = isPriceChangeValid ? `${priceChange.toFixed(2)}%` : '-'; 
  
  const currentPriceDisplay = coin.current_price 
    ? `$${coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : '-';
    
  // Calculate total holding value for the far right column (mocked)
  const totalHoldingValue = coin.current_price * MOCK_HOLDING_AMOUNT;
  const totalHoldingDisplay = `$${totalHoldingValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  
  // Icon for price change (red/green triangle)
  const ChangeIcon = isPriceChangeValid && priceChange < 0 ? '▼' : '▲';

  return (
    <Pressable style={styles.container} onPress={onPress}>
      
      {/* LEFT SECTION: Icon, Name/Symbol, Price/Change */}
      <View style={styles.leftSection}>
        {/* Coin Image/Logo */}
        <Image 
            source={{ uri: coin.image }} 
            style={styles.coinImage} 
            resizeMode="contain" 
        />
        
        <View style={styles.textContainer}>
            {/* Row 1: Name and Symbol Badge */}
            <View style={styles.topRow}>
                <Text style={styles.name}>{coin.name}</Text>
                <View style={styles.symbolBadge}>
                    <Text style={styles.symbolText}>{coin.symbol.toUpperCase()}</Text>
                </View>
            </View>
            
            {/* Row 2: Price and Price Change */}
            <View style={styles.bottomRow}>
                <Text style={styles.currentPrice}>{currentPriceDisplay}</Text>
                <Text style={[styles.change, { color: changeColor }]}>
                    {ChangeIcon} {changeText}
                </Text>
            </View>
        </View>
      </View>
      
      {/* RIGHT SECTION: Holding Amount and Total Value */}
      <View style={styles.rightSection}>
        {/* Row 1 (Top Right): Holding Amount */}
        <Text style={styles.holdingAmount}>{MOCK_HOLDING_AMOUNT.toFixed(4)}</Text>
        {/* Row 2 (Bottom Right): Total Holding Value */}
        <Text style={styles.holdingValue}>{totalHoldingDisplay}</Text>
      </View>
    </Pressable>
  );
};

// --- STYLING ---
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 25,
    backgroundColor: '#141022ff',
  },
  
  // --- Left Section Styles ---
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Allows the text content to take up space
  },
  coinImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
  },
  textContainer: {
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    //fontFamily: Inter,
  },
  symbolBadge: {
    backgroundColor: '#444', // Dark grey background for the symbol
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  symbolText: {
    color: '#CCC',
    fontSize: 10,
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPrice: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    marginRight: 10,
  },
  change: {
    fontSize: 13,
    fontWeight: '600',
  },
  
  // --- Right Section Styles ---
  rightSection: {
    alignItems: 'flex-end', // Aligns both lines to the right
    marginLeft: 10,
  },
  holdingAmount: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4, // Space between lines
  },
  holdingValue: {
    color: '#CCC',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default CoinListTile;