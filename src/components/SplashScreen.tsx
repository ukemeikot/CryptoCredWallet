import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated } from 'react-native';

const SplashScreen = () => {
    // Animation value for the pulsing effect
    const fadeAnim = new Animated.Value(0.2); 

    useEffect(() => {
        // Creates a pulsing loop (opacity goes from 0.2 -> 1.0 -> 0.2)
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.2,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [fadeAnim]);

    return (
        <View style={styles.container}>
            <Animated.Text style={[styles.logoText, { opacity: fadeAnim }]}>
                CryptoCredWallet
            </Animated.Text>
            <ActivityIndicator size="small" color="#4A90E2" style={styles.indicator} />
            <Text style={styles.tagline}>Securing your digital assets...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0A0A1F', // Deep Web3 background color
    },
    logoText: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 20,
        letterSpacing: 1.5,
        // Optional: Add a subtle text shadow for glow effect
        textShadowColor: '#4A90E280', 
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    tagline: {
        color: '#00FF7F', // Accent green
        fontSize: 14,
        marginTop: 10,
    },
    indicator: {
        marginTop: 10,
    }
});

export default SplashScreen;