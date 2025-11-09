

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
  };
  price_change_percentage_24h_in_currency: { 
        usd: number; // The specific currency we are using
        // You can add other currencies if needed, but 'usd' is sufficient
    };
  // Add 'links' if you want to show website/socials
}

// --- 3. Chart Data (IChartData) ---
// CoinGecko returns a list of [timestamp, price] arrays.
export type PricePoint = [number, number]; // [Unix timestamp, Price value]

export interface IChartData {
  prices: PricePoint[];
  market_caps: PricePoint[];
  total_volumes: PricePoint[];
}

export interface ICoin extends ICoinMarket {
  // Flag to track if the coin is bookmarked by the user.
  isFavorite: boolean; 
  // Add any other UI-specific flags here if needed later.
}