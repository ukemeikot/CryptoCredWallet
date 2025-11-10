// /src/components/BalanceCard.tsx

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Data is hardcoded here for the component's structure, 
// but would eventually be passed as props.
const BalanceCard = () => {
  return (
    <View style={styles.card}>
      {/* Balance Header */}
      <View style={styles.balanceHeader}>
        <Text style={styles.balanceLabel}>Current balance</Text>
        <Text style={styles.currency}>USD</Text>
      </View>
      
      {/* Balance Amount */}
      <Text style={styles.balanceAmount}>$354,935.18</Text>
      <Text style={styles.balanceChange}>↑ $85,884.32 (+24.2%)</Text>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        {['Send', 'Receive', 'Swap', 'More'].map((label) => (
          <View key={label} style={styles.actionButtonContainer}>
            <Pressable style={styles.actionButton}>
              <Ionicons 
                name={label.toLowerCase() === 'send' ? 'arrow-up' : label.toLowerCase() === 'receive' ? 'arrow-down' : label.toLowerCase() === 'swap' ? 'swap-horizontal' : 'ellipsis-horizontal'} 
                size={24} 
                color="#FFF" 
              />
            </Pressable>
            <Text style={styles.actionLabel}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#151434ff', // Dark, distinct background for the card
    padding: 25,
    marginHorizontal: 15,
    borderRadius: 20,
    marginTop: 15,
    marginBottom: 20,
    // Subtle shadow/elevation for the floating card effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  balanceLabel: {
    color: '#D4D4D4',
    fontSize: 14,
    marginRight: 8,
  },
  currency: {
    color: '#D4D4D4',
    fontSize: 14,
  },
  balanceAmount: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  balanceChange: {
    color: '#00FF7F', // Web3 accent green
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 5,
  },
  actionButtonContainer: {
    alignItems: 'center',
    width: '25%',
  },
  actionButton: {
    backgroundColor: '#3A3A5F',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  actionLabel: {
    color: '#D4D4D4',
    fontSize: 12,
  }
});

export default BalanceCard;