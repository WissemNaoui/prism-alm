import React from 'react';
import { Button } from './Button';
import { Account, AccountStatus, CurrencyType } from '../utils/accountStore';

interface AccountDetailsProps {
  account: Account;
  onEdit: () => void;
  onClose: () => void;
}

export function AccountDetails({ account, onEdit, onClose }: AccountDetailsProps) {
  // Format currency
  const formatCurrency = (amount: number, currency: CurrencyType) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
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

  return (
    <div className="space-y-6">
      {/* Header and action buttons */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Account Details
        </h3>
        <div className="flex space-x-2">
          <Button onClick={onEdit} variant="outline" size="sm">
            Edit
          </Button>
          <Button onClick={onClose} variant="outline" size="sm">
            Close
          </Button>
        </div>
      </div>

      {/* Account header info */}
      <div className="bg-white p-4 rounded-md shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-900">{account.accountName}</h2>
          <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(account.status)}`}>
            {account.status}
          </span>
        </div>
        <div className="text-sm text-gray-500 mb-4">
          Account Number: <span className="font-medium">{account.accountNumber}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-3xl font-bold text-gray-900">
            <span className={account.balance < 0 ? 'text-red-600' : ''}>
              {formatCurrency(account.balance, account.currency)}
            </span>
          </div>
          <div className="text-gray-500 text-sm">
            {account.availableBalance !== undefined && account.availableBalance !== null && (
              <div className="text-right">
                Available: <span className="font-medium">{formatCurrency(account.availableBalance, account.currency)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account details */}
      <div className="bg-white p-4 rounded-md shadow-sm">
        <h4 className="font-medium text-gray-900 mb-4">Account Information</h4>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Type</dt>
            <dd className="mt-1 text-sm text-gray-900">{account.accountType}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Currency</dt>
            <dd className="mt-1 text-sm text-gray-900">{account.currency}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Open Date</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(account.openDate)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Last Activity</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(account.lastActivityDate)}</dd>
          </div>
          {account.interestRate !== undefined && account.interestRate !== null && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Interest Rate</dt>
              <dd className="mt-1 text-sm text-gray-900">{account.interestRate}%</dd>
            </div>
          )}
          {account.maturityDate && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Maturity Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(account.maturityDate)}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Notes section */}
      {account.notes && (
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
          <div className="text-sm text-gray-600 whitespace-pre-line">{account.notes}</div>
        </div>
      )}
    </div>
  );
}
