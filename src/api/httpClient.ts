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

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is an Axios error and has a response status
    if (error.response) {
      const status = error.response.status;
      
      if (status === 401) {
        // Handle 401 (Unauthorized/Bad Key)
        error.message = "Authentication Failed. Please check your API key.";
      } else if (status === 429) {
        // Handle 429 (Rate Limit Exceeded - Common for free CoinGecko tier)
        error.message = "Rate Limit Exceeded. Please try again in one minute.";
      } else if (status >= 500) {
        // Handle 5xx Server Errors
        error.message = "Our server is having issues. Please try again shortly.";
      }
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        // Handle network timeouts (poor connection)
        error.message = "Connection Timed Out. Check your network.";
    }
    
    // Re-throw the error with the cleaned message
    return Promise.reject(error);
  }
);