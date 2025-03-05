import React, { useState } from 'react';
import { Button } from './Button';
import { Account, AccountStatus, AccountType, CurrencyType } from '../utils/accountStore';

interface AccountTableProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
  onView: (account: Account) => void;
}

type SortField = keyof Pick<Account, 'accountNumber' | 'accountName' | 'accountType' | 'balance' | 'status' | 'currency'>;

export function AccountTable({ accounts, onEdit, onDelete, onView }: AccountTableProps) {
  // State for sorting
  const [sortField, setSortField] = useState<SortField>('accountName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // State for filtering
  const [filterText, setFilterText] = useState('');
  const [filterAccountType, setFilterAccountType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Handle sort
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Sort and filter accounts
  const filteredAndSortedAccounts = [...accounts]
    // Filter by search text
    .filter(account => {
      if (!filterText) return true;
      
      const searchText = filterText.toLowerCase();
      return (
        account.accountNumber.toLowerCase().includes(searchText) ||
        account.accountName.toLowerCase().includes(searchText) ||
        account.notes?.toLowerCase().includes(searchText)
      );
    })
    // Filter by account type
    .filter(account => {
      if (filterAccountType === 'all') return true;
      return account.accountType === filterAccountType;
    })
    // Filter by status
    .filter(account => {
      if (filterStatus === 'all') return true;
      return account.status === filterStatus;
    })
    // Sort
    .sort((a, b) => {
      // Special handling for non-string fields
      if (sortField === 'balance') {
        return sortDirection === 'asc' 
          ? a.balance - b.balance
          : b.balance - a.balance;
      }
      
      // General case for string fields
      const aValue = String(a[sortField]).toLowerCase();
      const bValue = String(b[sortField]).toLowerCase();
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  
  // Format currency
  const formatCurrency = (amount: number, currency: CurrencyType) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return null;
    
    return sortDirection === 'asc' ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  // Get status color
  const getStatusColor = (status: AccountStatus) => {
    switch (status) {
      case AccountStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case AccountStatus.INACTIVE:
        return 'bg-gray-100 text-gray-800';
      case AccountStatus.CLOSED:
        return 'bg-red-100 text-red-800';
      case AccountStatus.FROZEN:
        return 'bg-blue-100 text-blue-800';
      case AccountStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Account type options for filter
  const accountTypeOptions = Object.values(AccountType);
  const statusOptions = Object.values(AccountStatus);

  return (
    <div className="space-y-4">
      {/* Filter section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-md shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input
              type="text"
              className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-primary focus:border-primary"
              placeholder="Search accounts..."
              onChange={(e) => setFilterText(e.target.value)}
              value={filterText}
            />
          </div>

          <div className="flex flex-row gap-2">
            <select
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2"
              value={filterAccountType}
              onChange={(e) => setFilterAccountType(e.target.value)}
            >
              <option value="all">All Account Types</option>
              {accountTypeOptions.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('accountNumber')}
              >
                <div className="flex items-center">
                  Account Number
                  {getSortIcon('accountNumber')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('accountName')}
              >
                <div className="flex items-center">
                  Account Name
                  {getSortIcon('accountName')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('accountType')}
              >
                <div className="flex items-center">
                  Type
                  {getSortIcon('accountType')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {getSortIcon('status')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('currency')}
              >
                <div className="flex items-center">
                  Currency
                  {getSortIcon('currency')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('balance')}
              >
                <div className="flex items-center">
                  Balance
                  {getSortIcon('balance')}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedAccounts.length > 0 ? (
              filteredAndSortedAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.accountNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {account.accountName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.accountType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(account.status)}`}>
                      {account.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={account.balance < 0 ? 'text-red-600' : 'text-gray-900'}>
                      {formatCurrency(account.balance, account.currency)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => onView(account)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onEdit(account)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onDelete(account)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  No accounts found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
