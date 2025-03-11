import { create } from 'zustand';
import { stockAPI, StockQuote, StockNews } from '../lib/api';

interface MarketState {
  quotes: Record<string, StockQuote>;
  news: StockNews[];
  watchlist: string[];
  loading: boolean;
  error: string | null;
  fetchQuote: (symbol: string) => Promise<void>;
  fetchNews: () => Promise<void>;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  startRealtimeUpdates: (symbols: string[]) => void;
  stopRealtimeUpdates: () => void;
}

export const useMarketStore = create<MarketState>((set, get) => {
  let updateInterval: NodeJS.Timeout | null = null;

  const fetchQuoteForSymbol = async (symbol: string) => {
    try {
      const quote = await stockAPI.getQuote(symbol);
      
      // Cache the successful response
      localStorage.setItem(`quote_${symbol}`, JSON.stringify(quote));
      
      set((state) => ({
        quotes: { ...state.quotes, [symbol]: quote },
        error: null,
      }));
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      
      // Don't update error state for rate limit errors
      if (error instanceof Error && !error.message.includes('rate limit')) {
        set((state) => ({
          error: `Failed to fetch quote for ${symbol}`,
        }));
      }
    }
  };

  return {
    quotes: {},
    news: [],
    watchlist: [],
    loading: false,
    error: null,

    fetchQuote: async (symbol: string) => {
      try {
        set({ loading: true, error: null });
        await fetchQuoteForSymbol(symbol);
      } finally {
        set({ loading: false });
      }
    },

    fetchNews: async () => {
      try {
        set({ loading: true, error: null });
        const news = await stockAPI.getNews();
        set({ news, loading: false });
      } catch (error) {
        set({ error: 'Failed to fetch news', loading: false });
      }
    },

    addToWatchlist: (symbol: string) => {
      set((state) => ({
        watchlist: [...new Set([...state.watchlist, symbol])],
      }));
    },

    removeFromWatchlist: (symbol: string) => {
      set((state) => ({
        watchlist: state.watchlist.filter((s) => s !== symbol),
      }));
    },

    startRealtimeUpdates: (symbols: string[]) => {
      // Clear any existing interval
      if (updateInterval) {
        clearInterval(updateInterval);
      }

      // Fetch initial data with a slight delay between each request
      symbols.forEach((symbol, index) => {
        setTimeout(() => {
          fetchQuoteForSymbol(symbol);
        }, index * 12000); // Space out requests every 12 seconds
      });

      // Set up interval for real-time updates (every 60 seconds)
      updateInterval = setInterval(() => {
        symbols.forEach((symbol, index) => {
          setTimeout(() => {
            fetchQuoteForSymbol(symbol);
          }, index * 12000); // Space out requests every 12 seconds
        });
      }, 60000);
    },

    stopRealtimeUpdates: () => {
      if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
      }
    },
  };
});