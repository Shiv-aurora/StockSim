import React, { useEffect } from 'react';
import { useMarketStore } from '../store/marketStore';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StockPriceProps {
  symbol: string;
}

export const StockPrice: React.FC<StockPriceProps> = ({ symbol }) => {
  const { quotes, fetchQuote } = useMarketStore();
  const quote = quotes[symbol];

  useEffect(() => {
    if (!quote) {
      fetchQuote(symbol);
    }
  }, [symbol]);

  if (!quote) {
    return <div className="animate-pulse bg-secondary h-6 w-24 rounded" />;
  }

  const isPositive = quote.change >= 0;
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <div className="flex flex-col">
      <div className="text-lg font-semibold">${quote.price.toFixed(2)}</div>
      <div className={`flex items-center ${changeColor} text-sm`}>
        {isPositive ? (
          <TrendingUp className="h-4 w-4 mr-1" />
        ) : (
          <TrendingDown className="h-4 w-4 mr-1" />
        )}
        {quote.changePercent.toFixed(2)}% (${Math.abs(quote.change).toFixed(2)})
      </div>
      <div className="text-xs text-muted-foreground">
        Last updated: {new Date(quote.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
};

export default StockPrice;