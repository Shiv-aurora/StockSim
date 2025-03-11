import React from 'react';
import { useAuthStore } from '../store/authStore';
import { TrendingUp, TrendingDown, PieChart } from 'lucide-react';

const Portfolio = () => {
  const { user } = useAuthStore();

  const mockPortfolio = [
    { symbol: 'AAPL', shares: 10, avgPrice: 150.00, currentPrice: 155.00, weight: 30 },
    { symbol: 'GOOGL', shares: 5, avgPrice: 2800.00, currentPrice: 2750.00, weight: 25 },
    { symbol: 'MSFT', shares: 15, avgPrice: 280.00, currentPrice: 290.00, weight: 45 },
  ];

  const totalValue = mockPortfolio.reduce(
    (sum, stock) => sum + stock.shares * stock.currentPrice,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
        <div className="text-lg text-gray-600">
          Total Value: <span className="font-semibold">${totalValue.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Holdings</h2>
              <PieChart className="h-6 w-6 text-gray-400" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-4">Symbol</th>
                    <th className="pb-4">Shares</th>
                    <th className="pb-4">Avg Price</th>
                    <th className="pb-4">Current Price</th>
                    <th className="pb-4">Total Value</th>
                    <th className="pb-4">Return</th>
                    <th className="pb-4">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPortfolio.map((stock) => {
                    const totalValue = stock.shares * stock.currentPrice;
                    const returnValue = (stock.currentPrice - stock.avgPrice) * stock.shares;
                    const returnPercent = ((stock.currentPrice - stock.avgPrice) / stock.avgPrice) * 100;

                    return (
                      <tr key={stock.symbol} className="border-b">
                        <td className="py-4 font-semibold">{stock.symbol}</td>
                        <td className="py-4">{stock.shares}</td>
                        <td className="py-4">${stock.avgPrice.toFixed(2)}</td>
                        <td className="py-4">${stock.currentPrice.toFixed(2)}</td>
                        <td className="py-4">${totalValue.toFixed(2)}</td>
                        <td className="py-4">
                          <div className={`flex items-center ${returnValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {returnValue >= 0 ? (
                              <TrendingUp className="w-4 h-4 mr-1" />
                            ) : (
                              <TrendingDown className="w-4 h-4 mr-1" />
                            )}
                            ${Math.abs(returnValue).toFixed(2)} ({returnPercent.toFixed(2)}%)
                          </div>
                        </td>
                        <td className="py-4">{stock.weight}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Portfolio Stats</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">Total Return</div>
                <div className="text-2xl font-bold text-green-600">+$450.00</div>
                <div className="text-sm text-green-600">+4.5%</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Today's Change</div>
                <div className="text-2xl font-bold text-red-600">-$120.00</div>
                <div className="text-sm text-red-600">-1.2%</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Diversification</h2>
            <div className="space-y-3">
              {mockPortfolio.map((stock) => (
                <div key={stock.symbol}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{stock.symbol}</span>
                    <span>{stock.weight}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${stock.weight}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;