/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    // Defines the type for the variables in your .env file
    EXPO_PUBLIC_COINGECKO_API_KEY: string;
    EXPO_PUBLIC_API_BASE_URL: string;
    // Will add other EXPO_PUBLIC_ variables here as you create them.
  }
}