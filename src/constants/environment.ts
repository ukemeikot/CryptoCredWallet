// the API keys are imported from 'process.env' and a strongly typed object is exported
//Allowing the rest of the app to import the config cleanly.

interface Environment {
  COINGECKO_API_KEY: string;
  API_BASE_URL: string;
}

// Use a safety check to ensure keys are present, especially if they are critical
const COINGECKO_API_KEY = process.env.EXPO_PUBLIC_COINGECKO_API_KEY;
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!COINGECKO_API_KEY || !API_BASE_URL) {
  // Throw an error early if critical keys are missing
  throw new Error("Missing critical environment variables: COINGECKO_API_KEY and/or API_BASE_URL are not set. Check your .env file.");
}

const ENV: Environment = {
  COINGECKO_API_KEY,
  API_BASE_URL,
};

export default ENV;