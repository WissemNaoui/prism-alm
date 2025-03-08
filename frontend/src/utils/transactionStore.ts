import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Account, AccountType, CurrencyType, useAccountStore } from './accountStore';

export enum TransactionType {
  DEPOSIT = 'Deposit',
  WITHDRAWAL = 'Withdrawal',
  TRANSFER = 'Transfer',
  INTEREST = 'Interest',
  FEE = 'Fee',
  LOAN_DISBURSEMENT = 'Loan Disbursement',
  LOAN_PAYMENT = 'Loan Payment'
}

export enum TransactionStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  CANCELLED = 'Cancelled'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  fromAccountId?: string;
  toAccountId?: string;
  amount: number;
  currency: CurrencyType;
  description: string;
  date: string;
  reference: string;
  metadata?: Record<string, any>;
}

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;

  // Actions
  createTransaction: (transaction: Omit<Transaction, 'id' | 'reference' | 'status' | 'date'>) => Promise<Transaction>;
  updateTransactionStatus: (id: string, status: TransactionStatus) => void;
  getAccountTransactions: (accountId: string) => Transaction[];
  searchTransactions: (query: string) => Transaction[];
}

// Helper function to generate a transaction reference
const generateTransactionReference = () => {
  const prefix = 'TXN';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Helper function to validate transaction
const validateTransaction = (
  transaction: Omit<Transaction, 'id' | 'reference' | 'status' | 'date'>,
  accounts: Account[]
): string | null => {
  // Validate amount
  if (transaction.amount <= 0) {
    return 'Transaction amount must be greater than 0';
  }

  // For transfers, validate accounts
  if (transaction.type === TransactionType.TRANSFER) {
    if (!transaction.fromAccountId || !transaction.toAccountId) {
      return 'Both source and destination accounts are required for transfers';
    }
    if (transaction.fromAccountId === transaction.toAccountId) {
      return 'Source and destination accounts must be different';
    }

    const fromAccount = accounts.find(acc => acc.id === transaction.fromAccountId);
    const toAccount = accounts.find(acc => acc.id === transaction.toAccountId);

    if (!fromAccount || !toAccount) {
      return 'Invalid account(s) specified';
    }

    if (fromAccount.currency !== transaction.currency || toAccount.currency !== transaction.currency) {
      return 'Currency mismatch between accounts and transaction';
    }

    // Check sufficient balance for withdrawals and transfers
    if (fromAccount.balance < transaction.amount) {
      return 'Insufficient balance in source account';
    }
  }

  // For withdrawals, validate account and balance
  if (transaction.type === TransactionType.WITHDRAWAL) {
    if (!transaction.fromAccountId) {
      return 'Source account is required for withdrawals';
    }

    const account = accounts.find(acc => acc.id === transaction.fromAccountId);
    if (!account) {
      return 'Invalid account specified';
    }

    if (account.currency !== transaction.currency) {
      return 'Currency mismatch between account and transaction';
    }

    if (account.balance < transaction.amount) {
      return 'Insufficient balance';
    }
  }

  return null;
};

// Create the transaction store
export const useTransactionStore = create<TransactionState>(
  persist(
    (set, get) => ({
      transactions: [],
      loading: false,
      error: null,

      createTransaction: async (transactionData) => {
        const { updateAccount } = useAccountStore.getState();
        const accounts = useAccountStore.getState().accounts;

        // Validate transaction
        const validationError = validateTransaction(transactionData, accounts);
        if (validationError) {
          throw new Error(validationError);
        }

        const newTransaction: Transaction = {
          ...transactionData,
          id: Date.now().toString(),
          reference: generateTransactionReference(),
          status: TransactionStatus.COMPLETED,
          date: new Date().toISOString(),
        };

        // Update account balances
        if (newTransaction.type === TransactionType.TRANSFER) {
          const fromAccount = accounts.find(acc => acc.id === newTransaction.fromAccountId);
          const toAccount = accounts.find(acc => acc.id === newTransaction.toAccountId);

          if (fromAccount && toAccount) {
            updateAccount({
              ...fromAccount,
              balance: fromAccount.balance - newTransaction.amount,
              lastActivityDate: newTransaction.date
            });

            updateAccount({
              ...toAccount,
              balance: toAccount.balance + newTransaction.amount,
              lastActivityDate: newTransaction.date
            });
          }
        } else if (newTransaction.type === TransactionType.WITHDRAWAL) {
          const account = accounts.find(acc => acc.id === newTransaction.fromAccountId);
          if (account) {
            updateAccount({
              ...account,
              balance: account.balance - newTransaction.amount,
              lastActivityDate: newTransaction.date
            });
          }
        } else if (newTransaction.type === TransactionType.DEPOSIT) {
          const account = accounts.find(acc => acc.id === newTransaction.toAccountId);
          if (account) {
            updateAccount({
              ...account,
              balance: account.balance + newTransaction.amount,
              lastActivityDate: newTransaction.date
            });
          }
        }

        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }));

        return newTransaction;
      },

      updateTransactionStatus: (id, status) => {
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === id ? { ...transaction, status } : transaction
          ),
        }));
      },

      getAccountTransactions: (accountId) => {
        const { transactions } = get();
        return transactions.filter(
          (transaction) =>
            transaction.fromAccountId === accountId ||
            transaction.toAccountId === accountId
        );
      },

      searchTransactions: (query) => {
        const { transactions } = get();
        const lowerCaseQuery = query.toLowerCase();

        return transactions.filter(
          (transaction) =>
            transaction.reference.toLowerCase().includes(lowerCaseQuery) ||
            transaction.description.toLowerCase().includes(lowerCaseQuery) ||
            transaction.type.toLowerCase().includes(lowerCaseQuery) ||
            transaction.status.toLowerCase().includes(lowerCaseQuery)
        );
      },
    }),
    {
      name: 'transaction-store',
      partialize: (state) => ({
        transactions: state.transactions,
      }),
    }
  )
);
