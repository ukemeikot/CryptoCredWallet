// --- 1. Coin List Data (ICoinMarket) ---
export interface ICoinMarket {
  id: string; // Used for fetching details and navigation
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number; // Important for price trend UI
  circulating_supply: number;
  // Add other fields you want to display on the list screen
}

// --- 2. Coin Detail Data (ICoinDetail) ---
export interface ICoinDetail {
  id: string;
  name: string;
  symbol: string;
  image: { large: string };
  description: { en: string }; // Use 'en' description for display
  market_data: {
    current_price: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
    // Add other relevant detail fields like market_cap, total_supply, etc.
    market_cap: { usd: number | null }; // Added for StatBox robustness
    total_volume: { usd: number | null }; // Added for StatBox robustness
  };
  price_change_percentage_24h_in_currency: { 
        usd: number; // The specific currency we are using
    };
  // Add 'links' if you want to show website/socials
}

// --- 3. Chart Data (IChartData) ---

// 🌟 FIX: Redefining PricePoint and IChartData for OHLC (Candlestick) data
// Format: [timestamp, open, high, low, close]
export type OHLCPoint = [number, number, number, number, number]; 

export interface IChartData {
  // NOTE: CoinGecko's OHLC endpoint directly returns an array of OHLCPoint[], 
  // unlike the market_chart endpoint which returns an object with nested arrays.
  // We will adjust the fetchMarketChart function to return this array directly.
  ohlc: OHLCPoint[]; // A clean structure to map the API response.
}

// --- 4. Application Coin Model (ICoin) ---
export interface ICoin extends ICoinMarket {
  // Flag to track if the coin is bookmarked by the user.
  isFavorite: boolean; 
}