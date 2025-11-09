
import { ICoin } from './coinTypes';


// Enum for clarity in state management
export type DataStatus = 'idle' | 'loading' | 'success' | 'error' | 'offline';

export interface ICoinListState {
  status: DataStatus;             // Tracks loading, error, success, offline states
  coins: ICoin[];                 // The main list of coins (includes isFavorite flag)
  favorites: string[];            // An array of favorited coin IDs (e.g., ['bitcoin', 'eth'])
  searchTerm: string;             // The current input value from the search bar
  error: string | null;           // Holds any error message
  // Add other state variables like pagination, filters, etc., here
}