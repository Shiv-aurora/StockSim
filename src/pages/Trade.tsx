import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Search } from 'lucide-react';

const Trade = () => {
  const { user } = useAuthStore();
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Trade logic will be implemented later
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Trade</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Place Order</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">
                Stock Symbol
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  id="symbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  className="input pr-10"
                  placeholder="e.g., AAPL"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="orderType" className="block text-sm font-medium text-gray-700">
                Order Type
              </label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType('buy')}
                  className={`py-2 px-4 rounded-lg font-medium ${
                    orderType === 'buy'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('sell')}
                  className={`py-2 px-4 rounded-lg font-medium ${
                    orderType === 'sell'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Sell
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="input mt-1"
                min="1"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              Preview Order
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Stock Information</h2>
          <div className="text-center py-8 text-gray-500">
            Enter a stock symbol to view details
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2">Date</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Symbol</th>
                <th className="pb-2">Quantity</th>
                <th className="pb-2">Price</th>
                <th className="pb-2">Total</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-8 text-center text-gray-500" colSpan={7}>
                  No recent orders
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Trade;