// /src/api/httpClient.ts
import axios from 'axios';
import ENV from '../constants/environment';

export const httpClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    // Inject the CoinGecko API Key into the header for every request
    'x-cg-demo-api-key': ENV.COINGECKO_API_KEY, 
  },
  timeout: 10000, // Handle slow networks: 10 seconds timeout
});