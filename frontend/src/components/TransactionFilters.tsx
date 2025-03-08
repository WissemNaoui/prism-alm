import React from 'react';
import { TransactionType, TransactionStatus } from '../utils/transactionStore';
import { CurrencyType } from '../utils/accountStore';

interface TransactionFiltersProps {
  onFilterChange: (filters: TransactionFilters) => void;
  filters: TransactionFilters;
}

export interface TransactionFilters {
  type: TransactionType | 'all';
  status: TransactionStatus | 'all';
  currency: CurrencyType | 'all';
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
  searchQuery: string;
}

export function TransactionFilters({ onFilterChange, filters }: TransactionFiltersProps) {
  const handleChange = (name: keyof TransactionFilters, value: string) => {
    onFilterChange({
      ...filters,
      [name]: value,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Query */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Search transactions..."
            value={filters.searchQuery}
            onChange={(e) => handleChange('searchQuery', e.target.value)}
          />
        </div>

        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            value={filters.type}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <option value="all">All Types</option>
            {Object.values(TransactionType).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="all">All Statuses</option>
            {Object.values(TransactionStatus).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Currency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            value={filters.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
          >
            <option value="all">All Currencies</option>
            {Object.values(CurrencyType).map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <input
            type="date"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            value={filters.dateFrom}
            onChange={(e) => handleChange('dateFrom', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <input
            type="date"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            value={filters.dateTo}
            onChange={(e) => handleChange('dateTo', e.target.value)}
          />
        </div>

        {/* Amount Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Amount
          </label>
          <input
            type="number"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="0.00"
            value={filters.amountMin}
            onChange={(e) => handleChange('amountMin', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Amount
          </label>
          <input
            type="number"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="0.00"
            value={filters.amountMax}
            onChange={(e) => handleChange('amountMax', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
