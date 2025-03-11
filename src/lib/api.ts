import axios from 'axios';

// You would typically store this in an environment variable
const ALPHA_VANTAGE_API_KEY = 'BDJ95TTNSET0XKB2';
const BASE_URL = 'https://www.alphavantage.co/query';

// Rate limiting configuration
const CALLS_PER_MINUTE = 5;
const requestQueue: Array<() => Promise<any>> = [];
let lastCallTime = 0;
let callsThisMinute = 0;

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  lastUpdated: string;
}

export interface StockNews {
  title: string;
  url: string;
  source: string;
  summary: string;
  image: string;
  publishedAt: string;
}

class StockAPI {
  private async executeRequest(request: () => Promise<any>): Promise<any> {
    const now = Date.now();
    
    // Reset counter if a minute has passed
    if (now - lastCallTime >= 60000) {
      callsThisMinute = 0;
      lastCallTime = now;
    }

    // If we've hit the rate limit, add to queue
    if (callsThisMinute >= CALLS_PER_MINUTE) {
      return new Promise((resolve, reject) => {
        requestQueue.push(async () => {
          try {
            const result = await request();
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      });
    }

    // Execute request
    callsThisMinute++;
    lastCallTime = now;
    
    const result = await request();

    // Process queue if possible
    if (requestQueue.length > 0 && callsThisMinute < CALLS_PER_MINUTE) {
      const nextRequest = requestQueue.shift();
      if (nextRequest) {
        nextRequest();
      }
    }

    return result;
  }

  private async get(endpoint: string, params: Record<string, string> = {}) {
    const request = async () => {
      try {
        const response = await axios.get(`${BASE_URL}${endpoint}`, {
          params: {
            ...params,
            apikey: ALPHA_VANTAGE_API_KEY,
          },
        });
        
        // Check for rate limit message in the response
        if (response.data?.Note?.includes('API call frequency')) {
          throw new Error('API rate limit exceeded');
        }
        
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 429) {
          throw new Error('API rate limit exceeded');
        }
        throw error;
      }
    };

    return this.executeRequest(request);
  }

  async getQuote(symbol: string): Promise<StockQuote> {
    try {
      const data = await this.get('', {
        function: 'GLOBAL_QUOTE',
        symbol,
      });

      const quote = data['Global Quote'];
      
      // Check if we have valid data
      if (!quote || Object.keys(quote).length === 0) {
        throw new Error('Invalid quote data received');
      }

      return {
        symbol: quote['01. symbol'] || symbol,
        price: parseFloat(quote['05. price']) || 0,
        change: parseFloat(quote['09. change']) || 0,
        changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0,
        volume: parseInt(quote['06. volume']) || 0,
        lastUpdated: quote['07. latest trading day'] || new Date().toISOString().split('T')[0],
      };
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      
      // Return cached data if available
      const cachedData = localStorage.getItem(`quote_${symbol}`);
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        return {
          ...parsed,
          lastUpdated: new Date(parsed.lastUpdated).toISOString(),
        };
      }

      // Return fallback data
      return {
        symbol,
        price: 0,
        change: 0,
        changePercent: 0,
        volume: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  async searchStocks(query: string) {
    try {
      const data = await this.get('', {
        function: 'SYMBOL_SEARCH',
        keywords: query,
      });

      return data.bestMatches?.map((match: any) => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        region: match['4. region'],
      })) || [];
    } catch (error) {
      console.error('Error searching stocks:', error);
      return [];
    }
  }

  async getDailyPrices(symbol: string) {
    try {
      const data = await this.get('', {
        function: 'TIME_SERIES_DAILY',
        symbol,
        outputsize: 'compact',
      });

      const timeSeries = data['Time Series (Daily)'];
      if (!timeSeries) {
        throw new Error('No daily price data available');
      }

      return Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
        date,
        open: parseFloat(values['1. open']) || 0,
        high: parseFloat(values['2. high']) || 0,
        low: parseFloat(values['3. low']) || 0,
        close: parseFloat(values['4. close']) || 0,
        volume: parseInt(values['5. volume']) || 0,
      }));
    } catch (error) {
      console.error(`Error fetching daily prices for ${symbol}:`, error);
      return [];
    }
  }

  async getIntraday(symbol: string) {
    try {
      const data = await this.get('', {
        function: 'TIME_SERIES_INTRADAY',
        symbol,
        interval: '5min',
      });

      const timeSeries = data['Time Series (5min)'];
      if (!timeSeries) {
        throw new Error('No intraday data available');
      }

      return Object.entries(timeSeries).map(([timestamp, values]: [string, any]) => ({
        timestamp,
        price: parseFloat(values['4. close']) || 0,
      }));
    } catch (error) {
      console.error(`Error fetching intraday data for ${symbol}:`, error);
      return [];
    }
  }

  async getNews(symbols: string[] = []): Promise<StockNews[]> {
    // For demo purposes, returning mock news data
    return [
      {
        title: 'Market Rally Continues as Tech Stocks Surge',
        url: 'https://example.com/news/1',
        source: 'Financial Times',
        summary: 'Technology stocks led the market higher as investors...',
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=500',
        publishedAt: new Date().toISOString(),
      },
      {
        title: 'Federal Reserve Signals Potential Rate Cut',
        url: 'https://example.com/news/2',
        source: 'Bloomberg',
        summary: 'The Federal Reserve indicated it might consider rate cuts...',
        image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=500',
        publishedAt: new Date().toISOString(),
      },
    ];
  }
}

export const stockAPI = new StockAPI();