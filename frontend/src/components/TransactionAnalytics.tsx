import React from 'react';
import { Transaction, TransactionType } from '../utils/transactionStore';
import { CurrencyType } from '../utils/accountStore';

interface TransactionAnalyticsProps {
  transactions: Transaction[];
}

export function TransactionAnalytics({ transactions }: TransactionAnalyticsProps) {
  // Calculate total transactions by type
  const transactionsByType = transactions.reduce((acc, transaction) => {
    acc[transaction.type] = (acc[transaction.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate total volume by currency
  const volumeByCurrency = transactions.reduce((acc, transaction) => {
    acc[transaction.currency] = (acc[transaction.currency] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  // Calculate success rate
  const successRate = transactions.length > 0
    ? (transactions.filter(t => t.status === 'Completed').length / transactions.length) * 100
    : 0;

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Transaction Count by Type */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Transactions by Type</h3>
        <div className="space-y-2">
          {Object.entries(transactionsByType).map(([type, count]) => (
            <div key={type} className="flex justify-between items-center">
              <span className="text-gray-600">{type}</span>
              <span className="font-medium text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Volume by Currency */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Volume by Currency</h3>
        <div className="space-y-2">
          {Object.entries(volumeByCurrency).map(([currency, volume]) => (
            <div key={currency} className="flex justify-between items-center">
              <span className="text-gray-600">{currency}</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(volume, currency)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Success Rate */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Success Rate</h3>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/10">
                Success Rate
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-primary">
                {successRate.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/10">
            <div
              style={{ width: `${successRate}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
