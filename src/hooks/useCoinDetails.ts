// /src/hooks/useCoinDetails.ts

import { useState, useEffect, useCallback } from 'react';
import { fetchCoinDetails, fetchMarketChart } from '../api/cryptoService';
import { ICoinDetail, PricePoint } from '../types/coinTypes';
import { DataStatus } from '../types/hookTypes';

// Define a type for the state of the Detail Screen
interface ICoinDetailState {
    status: DataStatus;
    details: ICoinDetail | null;
    chartData: PricePoint[]; // Array of [timestamp, price]
    error: string | null;
}

const initialState: ICoinDetailState = {
    status: 'idle' as DataStatus,
    details: null,
    chartData: [],
    error: null,
};

export const useCoinDetails = (coinId: string) => {
    const [state, setState] = useState<ICoinDetailState>(initialState);

    const fetchDetails = useCallback(async () => {
        if (!coinId) return; // Prevent fetching if ID is missing

        setState(s => ({ ...s, status: 'loading', error: null }));

        try {
            // Fetching details and chart data concurrently
            const [detailResponse, chartResponse] = await Promise.all([
                fetchCoinDetails(coinId),
                fetchMarketChart(coinId, 30), // Fetch 30 days of data for a comprehensive chart
            ]);

            setState(s => ({
                ...s,
                status: 'success',
                details: detailResponse,
                // Assuming you've added price_change_percentage_24h_in_currency to ICoinDetail 
                // and adjusted cryptoService.ts to fetch it.
                chartData: chartResponse.prices, // Use only the price array
            }));

        } catch (e: any) {
            const isOffline = e.message.includes('Network Error');
            setState(s => ({
                ...s,
                status: isOffline ? 'offline' : 'error',
                error: isOffline ? 'You appear to be offline.' : (e.message || 'Failed to load coin details.'),
                details: null,
                chartData: [],
            }));
        }
    }, [coinId]); 

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    // Return data and a retry/refresh function
    return {
        ...state,
        fetchDetails,
    };
};