import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Account, AccountStatus, AccountType, CurrencyType } from '../utils/accountStore';

interface AccountFormProps {
  account?: Account;
  onSubmit: (accountData: Omit<Account, 'id' | 'accountNumber'>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

type FormData = Omit<Account, 'id' | 'accountNumber'> & {
  accountNumber?: string;
};

export function AccountForm({ account, onSubmit, onCancel, isSubmitting = false }: AccountFormProps) {
  // Initialize form data
  const [formData, setFormData] = useState<FormData>({
    accountName: '',
    accountType: AccountType.CHECKING,
    status: AccountStatus.ACTIVE,
    currency: CurrencyType.USD,
    balance: 0,
    availableBalance: undefined,
    interestRate: undefined,
    maturityDate: undefined,
    openDate: new Date().toISOString().split('T')[0],
    lastActivityDate: undefined,
    notes: ''
  });

  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load account data if editing
  useEffect(() => {
    if (account) {
      setFormData({
        ...account,
        maturityDate: account.maturityDate || undefined,
        lastActivityDate: account.lastActivityDate || undefined
      });
    }
  }, [account]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle numeric inputs
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? undefined : parseFloat(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.accountName.trim()) {
      newErrors.accountName = 'Account name is required';
    }
    
    if (!formData.openDate) {
      newErrors.openDate = 'Open date is required';
    }
    
    // If account type is LOAN or MORTGAGE, interest rate is required
    if ((formData.accountType === AccountType.LOAN || formData.accountType === AccountType.MORTGAGE) && 
        (formData.interestRate === undefined || formData.interestRate < 0)) {
      newErrors.interestRate = 'Interest rate is required for loans and mortgages';
    }
    
    // If account type is CERTIFICATE or INVESTMENT, maturity date is required
    if ((formData.accountType === AccountType.CERTIFICATE || formData.accountType === AccountType.INVESTMENT) && 
        !formData.maturityDate) {
      newErrors.maturityDate = 'Maturity date is required for certificates and investments';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Remove accountNumber from the form data when submitting (if it exists)
      const { accountNumber, ...submitData } = formData;
      onSubmit(submitData as Omit<Account, 'id' | 'accountNumber'>);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Account Name */}
        <div>
          <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">
            Account Name *
          </label>
          <input
            type="text"
            name="accountName"
            id="accountName"
            value={formData.accountName}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${errors.accountName ? 'border-red-500' : ''}`}
            required
          />
          {errors.accountName && (
            <p className="mt-1 text-sm text-red-600">{errors.accountName}</p>
          )}
        </div>

        {/* Account Number (readonly if editing) */}
        {account && (
          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
              Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              id="accountNumber"
              value={account.accountNumber}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm"
            />
          </div>
        )}

        {/* Account Type */}
        <div>
          <label htmlFor="accountType" className="block text-sm font-medium text-gray-700">
            Account Type *
          </label>
          <select
            name="accountType"
            id="accountType"
            value={formData.accountType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          >
            {Object.values(AccountType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Account Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status *
          </label>
          <select
            name="status"
            id="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          >
            {Object.values(AccountStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Currency */}
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
            Currency *
          </label>
          <select
            name="currency"
            id="currency"
            value={formData.currency}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          >
            {Object.values(CurrencyType).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        {/* Balance */}
        <div>
          <label htmlFor="balance" className="block text-sm font-medium text-gray-700">
            Balance *
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">
                {formData.currency === CurrencyType.USD ? '$' : ''}
              </span>
            </div>
            <input
              type="number"
              name="balance"
              id="balance"
              value={formData.balance}
              onChange={handleChange}
              step="0.01"
              className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="0.00"
              required
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">{formData.currency}</span>
            </div>
          </div>
        </div>

        {/* Available Balance (optional) */}
        <div>
          <label htmlFor="availableBalance" className="block text-sm font-medium text-gray-700">
            Available Balance
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">
                {formData.currency === CurrencyType.USD ? '$' : ''}
              </span>
            </div>
            <input
              type="number"
              name="availableBalance"
              id="availableBalance"
              value={formData.availableBalance ?? ''}
              onChange={handleChange}
              step="0.01"
              className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="0.00"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">{formData.currency}</span>
            </div>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">
            Interest Rate {(formData.accountType === AccountType.LOAN || formData.accountType === AccountType.MORTGAGE) ? '*' : ''}
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="number"
              name="interestRate"
              id="interestRate"
              value={formData.interestRate ?? ''}
              onChange={handleChange}
              step="0.01"
              className={`block w-full rounded-md border-gray-300 pr-12 focus:border-primary focus:ring-primary sm:text-sm ${errors.interestRate ? 'border-red-500' : ''}`}
              placeholder="0.00"
              required={formData.accountType === AccountType.LOAN || formData.accountType === AccountType.MORTGAGE}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">%</span>
            </div>
          </div>
          {errors.interestRate && (
            <p className="mt-1 text-sm text-red-600">{errors.interestRate}</p>
          )}
        </div>

        {/* Open Date */}
        <div>
          <label htmlFor="openDate" className="block text-sm font-medium text-gray-700">
            Open Date *
          </label>
          <input
            type="date"
            name="openDate"
            id="openDate"
            value={formData.openDate}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${errors.openDate ? 'border-red-500' : ''}`}
            required
          />
          {errors.openDate && (
            <p className="mt-1 text-sm text-red-600">{errors.openDate}</p>
          )}
        </div>

        {/* Maturity Date (conditional) */}
        <div>
          <label htmlFor="maturityDate" className="block text-sm font-medium text-gray-700">
            Maturity Date {(formData.accountType === AccountType.CERTIFICATE || formData.accountType === AccountType.INVESTMENT) ? '*' : ''}
          </label>
          <input
            type="date"
            name="maturityDate"
            id="maturityDate"
            value={formData.maturityDate ?? ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${errors.maturityDate ? 'border-red-500' : ''}`}
            required={formData.accountType === AccountType.CERTIFICATE || formData.accountType === AccountType.INVESTMENT}
          />
          {errors.maturityDate && (
            <p className="mt-1 text-sm text-red-600">{errors.maturityDate}</p>
          )}
        </div>

        {/* Last Activity Date */}
        <div>
          <label htmlFor="lastActivityDate" className="block text-sm font-medium text-gray-700">
            Last Activity Date
          </label>
          <input
            type="date"
            name="lastActivityDate"
            id="lastActivityDate"
            value={formData.lastActivityDate ?? ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          name="notes"
          id="notes"
          rows={3}
          value={formData.notes ?? ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          placeholder="Add any additional information about this account"
        />
      </div>

      {/* Submit buttons */}
      <div className="flex justify-end space-x-3">
        <Button type="button" onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : account ? 'Update Account' : 'Create Account'}
        </Button>
      </div>
    </form>
  );
}
