import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { DashboardCard } from '../components/DashboardCard';
import { Button } from '../components/Button';
import { useTransactionStore, TransactionType, Transaction, TransactionStatus } from '../utils/transactionStore';
import { useAccountStore, CurrencyType } from '../utils/accountStore';
import { TransactionFilters, TransactionFilters as FilterType } from '../components/TransactionFilters';
import { TransactionAnalytics } from '../components/TransactionAnalytics';
import { toast } from 'sonner';

// Transaction form interface
interface TransactionFormData {
  type: TransactionType;
  fromAccountId?: string;
  toAccountId?: string;
  amount: number;
  currency: CurrencyType;
  description: string;
}

export default function Transactions() {
  const { accounts } = useAccountStore();
  const { transactions, createTransaction } = useTransactionStore();
  
  // UI state
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<TransactionType>(TransactionType.DEPOSIT);
  const [formData, setFormData] = useState<TransactionFormData>({
    type: TransactionType.DEPOSIT,
    amount: 0,
    currency: CurrencyType.USD,
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtering state
  const [filters, setFilters] = useState<FilterType>({
    type: 'all',
    status: 'all',
    currency: 'all',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    searchQuery: '',
  });

  // Filtered transactions
  const filteredTransactions = transactions.filter(transaction => {
    if (filters.type !== 'all' && transaction.type !== filters.type) return false;
    if (filters.status !== 'all' && transaction.status !== filters.status) return false;
    if (filters.currency !== 'all' && transaction.currency !== filters.currency) return false;
    
    if (filters.dateFrom && new Date(transaction.date) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(transaction.date) > new Date(filters.dateTo)) return false;
    
    if (filters.amountMin && transaction.amount < parseFloat(filters.amountMin)) return false;
    if (filters.amountMax && transaction.amount > parseFloat(filters.amountMax)) return false;
    
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        transaction.reference.toLowerCase().includes(query) ||
        transaction.description.toLowerCase().includes(query) ||
        transaction.type.toLowerCase().includes(query) ||
        transaction.status.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Handle transaction creation
  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createTransaction(formData);
      setIsTransactionModalOpen(false);
      toast.success('Transaction completed successfully');
      
      // Reset form
      setFormData({
        type: TransactionType.DEPOSIT,
        amount: 0,
        currency: CurrencyType.USD,
        description: '',
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Export transactions
  const exportTransactions = () => {
    const csvContent = [
      // CSV Headers
      ['Date', 'Reference', 'Type', 'From Account', 'To Account', 'Amount', 'Currency', 'Status', 'Description'].join(','),
      // CSV Data
      ...filteredTransactions.map(transaction => [
        formatDate(transaction.date),
        transaction.reference,
        transaction.type,
        transaction.fromAccountId ? accounts.find(acc => acc.id === transaction.fromAccountId)?.accountName : '-',
        transaction.toAccountId ? accounts.find(acc => acc.id === transaction.toAccountId)?.accountName : '-',
        transaction.amount,
        transaction.currency,
        transaction.status,
        `"${transaction.description}"`,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success('Transactions exported successfully');
  };

  return (
    <DashboardLayout title="Financial Transactions">
      <div className="space-y-6">
        {/* Analytics Section */}
        <DashboardCard title="Transaction Analytics" subtitle="Key metrics and insights">
          <TransactionAnalytics transactions={filteredTransactions} />
        </DashboardCard>

        {/* Transactions Section */}
        <DashboardCard
          title="Transactions"
          subtitle="Manage financial transactions"
          action={
            <div className="flex space-x-2">
              <Button onClick={exportTransactions} className="bg-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </Button>
              <Button onClick={() => setIsTransactionModalOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Transaction
              </Button>
            </div>
          }
        >
          {/* Filters */}
          <TransactionFilters
            filters={filters}
            onFilterChange={setFilters}
          />

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {transaction.reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.fromAccountId ? 
                        accounts.find(acc => acc.id === transaction.fromAccountId)?.accountName :
                        '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.toAccountId ?
                        accounts.find(acc => acc.id === transaction.toAccountId)?.accountName :
                        '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${transaction.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          transaction.status === 'Failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </div>

      {/* New Transaction Modal */}
      {isTransactionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">New Transaction</h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setIsTransactionModalOpen(false)}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateTransaction}>
                <div className="space-y-4">
                  {/* Transaction Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
                    <select
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
                      value={formData.type}
                      onChange={(e) => {
                        const type = e.target.value as TransactionType;
                        setFormData({ ...formData, type });
                        setSelectedType(type);
                      }}
                    >
                      <option value={TransactionType.DEPOSIT}>Deposit</option>
                      <option value={TransactionType.WITHDRAWAL}>Withdrawal</option>
                      <option value={TransactionType.TRANSFER}>Transfer</option>
                    </select>
                  </div>

                  {/* From Account (for withdrawals and transfers) */}
                  {(selectedType === TransactionType.WITHDRAWAL || selectedType === TransactionType.TRANSFER) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">From Account</label>
                      <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
                        value={formData.fromAccountId || ''}
                        onChange={(e) => setFormData({ ...formData, fromAccountId: e.target.value })}
                        required
                      >
                        <option value="">Select account</option>
                        {accounts.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.accountName} ({formatCurrency(account.balance, account.currency)})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* To Account (for deposits and transfers) */}
                  {(selectedType === TransactionType.DEPOSIT || selectedType === TransactionType.TRANSFER) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">To Account</label>
                      <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
                        value={formData.toAccountId || ''}
                        onChange={(e) => setFormData({ ...formData, toAccountId: e.target.value })}
                        required
                      >
                        <option value="">Select account</option>
                        {accounts.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.accountName} ({formatCurrency(account.balance, account.currency)})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">USD</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      rows={3}
                      className="shadow-sm focus:ring-primary focus:border-primary mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    type="button"
                    onClick={() => setIsTransactionModalOpen(false)}
                    className="bg-white text-gray-700 border border-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary"
                  >
                    {isSubmitting ? 'Processing...' : 'Create Transaction'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
