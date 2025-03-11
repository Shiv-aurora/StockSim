import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useMarketStore } from '../store/marketStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, BarChart2, Clock } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { NewsCard } from '../components/NewsCard';
import { StockPrice } from '../components/StockPrice';

const WATCHED_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META'];

const Dashboard = () => {
  const { user } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const { quotes, news, startRealtimeUpdates, stopRealtimeUpdates, fetchNews } = useMarketStore();
  const [timeframe, setTimeframe] = useState('1D');

  useEffect(() => {
    // Start real-time updates for watched symbols
    startRealtimeUpdates(WATCHED_SYMBOLS);
    fetchNews();

    // Cleanup on unmount
    return () => {
      stopRealtimeUpdates();
    };
  }, []);

  const mockData = [
    { date: '2024-01-01', value: 10000 },
    { date: '2024-01-02', value: 10500 },
    { date: '2024-01-03', value: 10300 },
    { date: '2024-01-04', value: 10800 },
    { date: '2024-01-05', value: 11200 },
    { date: '2024-01-06', value: 11000 },
    { date: '2024-01-07', value: 11500 }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload[0]) return null;
    
    return (
      <div className="chart-tooltip">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-sm">
          Value: ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            {user ? `Welcome back, ${user.email}` : 'Welcome to StockSim'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <SearchBar />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Portfolio Value</h2>
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold text-primary">$11,500.00</div>
          <div className="flex items-center text-green-500 text-sm mt-2">
            <TrendingUp className="h-4 w-4 mr-1" />
            +15.00% ($1,500)
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">24h Volume</h2>
            <BarChart2 className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold">$2.5M</div>
          <div className="flex items-center text-green-500 text-sm mt-2">
            <TrendingUp className="h-4 w-4 mr-1" />
            +5.23%
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Active Positions</h2>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold">5</div>
          <div className="text-muted-foreground text-sm mt-2">
            Across 3 sectors
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Last Trade</h2>
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold">AAPL</div>
          <div className="text-green-500 text-sm mt-2">
            Buy • $175.34
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Portfolio Performance</h2>
          <div className="flex space-x-2">
            {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  timeframe === tf
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={mockData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
          <div className="space-y-4">
            {WATCHED_SYMBOLS.map((symbol) => (
              <div key={symbol} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <div className="font-semibold">{symbol}</div>
                  <div className="text-sm text-muted-foreground">
                    Volume: {quotes[symbol]?.volume.toLocaleString() || '-'}
                  </div>
                </div>
                <StockPrice symbol={symbol} />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Market News</h2>
          <div className="space-y-4">
            {news.map((item, index) => (
              <NewsCard key={index} news={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;