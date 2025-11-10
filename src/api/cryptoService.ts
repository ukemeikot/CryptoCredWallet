import { httpClient } from './httpClient';
// Assuming ICoinDetail and IChartData were correctly updated in types/coinTypes.ts 
// to use the OHLC format (array of arrays).
import { ICoinMarket, ICoinDetail, IChartData, OHLCPoint } from '../types/coinTypes'; 

// --- API Methods ---

// 1. Fetch List of Coins (for CoinListScreen)
export async function fetchCoinMarkets(): Promise<ICoinMarket[]> {
  const response = await httpClient.get('/coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 50,
      page: 1,
      sparkline: false,
      price_change_percentage: '1h,24h,7d',
    },
  });
  return response.data;
}

// 2. Fetch Single Coin Details (for CoinDetailScreen)
export async function fetchCoinDetails(coinId: string): Promise<ICoinDetail> {
  const response = await httpClient.get(`/coins/${coinId}`, {
    params: {
      localization: 'false',
      tickers: 'false',
      community_data: 'false', // Reduce payload size
      developer_data: 'false', // Reduce payload size
    },
  });
  return response.data;
}

// 3. Fetch Price Chart Data (Updated to OHLC/Candlestick Endpoint)
// NOTE: We change the path to '/ohlc' and return the raw array data.
export async function fetchMarketChart(coinId: string, days: number = 7): Promise<OHLCPoint[]> {
  // OHLC data is typically daily for ranges above 7 days. 
  // We use the OHLC endpoint which returns [timestamp, open, high, low, close].
  const response = await httpClient.get(`/coins/${coinId}/ohlc`, {
    params: {
      vs_currency: 'usd',
      days: days, 
      // CoinGecko automatically adjusts granularity based on 'days' parameter.
    },
  });
  
  // The OHLC endpoint returns an array of arrays directly: [[t, o, h, l, c], ...]
  // We cast the response data directly to the expected OHLCPoint array.
  return response.data as OHLCPoint[];
}