import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Trophy, TrendingUp, Users } from 'lucide-react';

const Leaderboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-yellow-900">Top Trader</h2>
            <Trophy className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="text-center py-6">
            <div className="text-2xl font-bold text-yellow-900">-</div>
            <div className="text-yellow-700 mt-1">Portfolio Value: $0</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-green-900">Best Return</h2>
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-center py-6">
            <div className="text-2xl font-bold text-green-900">-</div>
            <div className="text-green-700 mt-1">Return: 0%</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-blue-900">Active Traders</h2>
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-center py-6">
            <div className="text-2xl font-bold text-blue-900">0</div>
            <div className="text-blue-700 mt-1">This Week</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Top Traders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-4">Rank</th>
                <th className="pb-4">Trader</th>
                <th className="pb-4">Portfolio Value</th>
                <th className="pb-4">Return</th>
                <th className="pb-4">Top Holdings</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-8 text-center text-gray-500" colSpan={5}>
                  No traders to display
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;