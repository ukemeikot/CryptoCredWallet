CryptoCredWallet Dashboard

This project implements a high-performance, resilient Crypto Wallet UI dashboard that fetches and displays live cryptocurrency market data.  The design adheres to a dark, modern Web3 aesthetic.

Technologies

React Native (Expo Router), TypeScript, CoinGecko API, AsyncStorage

🌟 Core & Bonus Features Implemented

The application showcases production-readiness through robust data handling, complex UI integration, and resilience features.

Mandatory Deliverables:

Live Asset List: Displays coin names, symbols, prices, and 24h change.

Detail Screen with Chart: Displays comprehensive market data (Volume, Market Cap, High/Low) and a customizable Candlestick Chart (OHLC).

Resilience (Offline/Error Handling): On API failure (e.g., 401 error or offline status), the app loads and displays the Last Known Good Data (cached locally via AsyncStorage), preventing a blank screen.

State Management: Gracefully handles Loading, Error, and Retry states via dedicated screen components.

Bonus Features:

✅ Custom Design: Full UI overhaul with a background gradient, floating elements, and a dark/high-contrast Web3 visual style.

✅ Time Frame Selection: Allows users to select different time periods (H, D, W, M, etc.) to dynamically update the Candlestick Chart data.

✅ Search: Client-side filtering of assets by name and symbol across the entire list.

✅ Favorites: Persistent storage and display of favorited coins across app sessions.

✅ Theme Toggling: Bonus functionality allowing users to switch between Dark (Web3) and Light (Standard) themes.

💻 Local Setup and Installation

Follow these steps to set up and run the CryptoCredWallet app locally.

Prerequisites

Node.js (LTS version)

npm or Yarn

Expo CLI (npm install -g expo-cli)

Android Studio / Xcode (for emulator/simulator)

Steps

Clone the Repository:

git clone (https://github.com/ukemeikot/CryptoCredWallet)
cd [CryptoCredWallet]


Install Dependencies:
The project relies on specific packages for charting and persistence:

npm install
# OR
yarn install


(Note: The main chart library dependencies are installed via expo install or are included in package.json.)

Configure API Key (CRUCIAL):

Create a file named .env in the project root.

Obtain a free API key from the CoinGecko documentation.

Ensure .env is listed in your .gitignore to prevent commitment.

Add your configuration variables:

EXPO_PUBLIC_COINGECKO_API_KEY=YOUR_COINGECKO_API_KEY_HERE
EXPO_PUBLIC_API_BASE_URL=[https://api.coingecko.com/api/v3](https://api.coingecko.com/api/v3)


Start the Application:
The --clear flag is recommended for the first run to ensure clean asset loading.

npx expo start --clear


Run on your emulator/simulator by pressing a (Android) or i (iOS) in the terminal, or scan the QR code with the Expo Go app.

🔗 Task Deliverables (Submission Links)


Deliverable

Link

GitHub Repository: (https://github.com/ukemeikot/CryptoCredWallet)


Demo Video Link (2-4 minutes)

[Link to Google Drive / Loom / Dropbox Video]

Release APK Download Link

[Direct Download Link to the Compiled APK File]

