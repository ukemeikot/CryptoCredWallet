// /src/hooks/useCoinDetails.ts

import { useState, useEffect, useCallback } from 'react';
import { fetchCoinDetails, fetchMarketChart } from '../api/cryptoService';
// 🌟 FIX 1: Import OHLCPoint instead of PricePoint (which is now outdated)
import { ICoinDetail, OHLCPoint } from '../types/coinTypes'; 
import { DataStatus } from '../types/hookTypes';
import { getLastCoinDetail, saveCoinDetail } from '../api/favoritesService'; 


// Define a type for the state of the Detail Screen
interface ICoinDetailState {
    status: DataStatus;
    details: ICoinDetail | null;
    // 🌟 FIX 2: Change internal state type to reflect the new OHLC data structure
    chartData: OHLCPoint[]; 
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
    const [timeFrame, setTimeFrame] = useState<number>(30); 

    const fetchDetails = useCallback(async () => {
        if (!coinId) return;

        // Phase 1: Load Persisted Data Immediately
        const localDetails = await getLastCoinDetail(coinId); 
        
        if (localDetails) {
            setState(s => ({
                ...s,
                status: 'loading',
                details: localDetails,
                error: null,
            }));
        } else {
            setState(s => ({ ...s, status: 'loading', error: null }));
        }

        try {
            // Phase 2: Fetch fresh data, using the dynamic timeFrame
            const [detailResponse, chartResponse] = await Promise.all([
                fetchCoinDetails(coinId),
                // chartResponse is now an OHLCPoint[] array
                fetchMarketChart(coinId, timeFrame), 
            ]);

            // Phase 3: Success! Save new data and update state
            saveCoinDetail(coinId, detailResponse); 

            setState(s => ({
                ...s,
                status: 'success',
                details: detailResponse,
                // 🌟 FIX 3: Assign the raw chartResponse array directly.
                // It is already typed as OHLCPoint[] by fetchMarketChart.
                chartData: chartResponse, 
                error: null,
            }));

        } catch (e: any) {
            // Phase 4: API Failure (Persistence Fallback)
            const isOffline = e.message.includes('Network Error');
            
            const errorMessage = localDetails ? 
                (isOffline ? 'Offline Mode: Displaying last known data.' : 'Update failed. Using cached data.') :
                'Failed to load any data. Please retry.';

            setState(s => ({
                ...s,
                status: localDetails ? 'success' : (isOffline ? 'offline' : 'error'), 
                error: errorMessage,
                // On failure, chartData remains empty, prompting the chart UI to show 'not available'
            }));
        }
    }, [coinId, timeFrame]); // Dependency ensures re-fetch on timeFrame change

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    // Return data, retry/refresh function, and the time frame controls
    return {
        ...state,
        fetchDetails,
        timeFrame,
        setTimeFrame, 
    };
};