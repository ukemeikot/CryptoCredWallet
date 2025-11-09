import { httpClient } from './httpClient';
import { ICoinMarket, ICoinDetail, IChartData } from '../types/coinTypes';

// --- API Methods ---

// 1. Fetch List of Coins (for CoinListScreen)//
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
  // The .data property will automatically be typed as ICoinMarket[]
  return response.data;
}

// 2. Fetch Single Coin Details (for CoinDetailScreen)//
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

// 3. Fetch Price Chart Data//
export async function fetchMarketChart(coinId: string, days: number = 7): Promise<IChartData> {
  const response = await httpClient.get(`/coins/${coinId}/market_chart`, {
    params: {
      vs_currency: 'usd',
      days: days, // Fetch 7 days of data for the chart
    },
  });
  return response.data;
}