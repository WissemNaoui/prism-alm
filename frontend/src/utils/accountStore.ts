import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Account types
export enum AccountType {
  CHECKING = 'Checking',
  SAVINGS = 'Savings',
  LOAN = 'Loan',
  MORTGAGE = 'Mortgage',
  INVESTMENT = 'Investment',
  CERTIFICATE = 'Certificate',
  CREDIT_LINE = 'Credit Line',
  OTHER = 'Other'
}

// Currency types
export enum CurrencyType {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  CAD = 'CAD',
  AUD = 'AUD',
  CHF = 'CHF',
  CNY = 'CNY'
}

// Account status
export enum AccountStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  CLOSED = 'Closed',
  FROZEN = 'Frozen',
  PENDING = 'Pending'
}

// Account interface
export interface Account {
  id: string;
  accountNumber: string;
  accountType: AccountType;
  accountName: string;
  status: AccountStatus;
  currency: CurrencyType;
  balance: number;
  availableBalance?: number;
  interestRate?: number;
  maturityDate?: string;
  openDate: string;
  lastActivityDate?: string;
  notes?: string;
}

// Helper function to generate a unique account number
const generateAccountNumber = () => {
  const chars = '0123456789';
  let result = '';
  
  // Generate random 10-digit account number
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

// Initial sample accounts
const sampleAccounts: Account[] = [
  {
    id: '1',
    accountNumber: '1234567890',
    accountName: 'Main Checking Account',
    accountType: AccountType.CHECKING,
    status: AccountStatus.ACTIVE,
    currency: CurrencyType.USD,
    balance: 15750.50,
    availableBalance: 15750.50,
    interestRate: 0.01,
    openDate: '2023-01-15',
    lastActivityDate: '2023-11-30',
    notes: 'Primary transaction account for daily operations'
  },
  {
    id: '2',
    accountNumber: '0987654321',
    accountName: 'Reserve Savings',
    accountType: AccountType.SAVINGS,
    status: AccountStatus.ACTIVE,
    currency: CurrencyType.USD,
    balance: 250000.00,
    availableBalance: 250000.00,
    interestRate: 0.5,
    openDate: '2023-02-10',
    lastActivityDate: '2023-11-15',
    notes: 'Emergency fund and short-term liquidity reserve'
  },
  {
    id: '3',
    accountNumber: '5647382910',
    accountName: 'Commercial Loan - Office Building',
    accountType: AccountType.LOAN,
    status: AccountStatus.ACTIVE,
    currency: CurrencyType.USD,
    balance: -750000.00,
    interestRate: 4.25,
    openDate: '2023-03-20',
    maturityDate: '2033-03-20',
    lastActivityDate: '2023-11-20',
    notes: 'Commercial real estate loan for downtown office property'
  },
  {
    id: '4',
    accountNumber: '1122334455',
    accountName: 'Short-term Treasury Investment',
    accountType: AccountType.INVESTMENT,
    status: AccountStatus.ACTIVE,
    currency: CurrencyType.USD,
    balance: 500000.00,
    interestRate: 2.1,
    openDate: '2023-06-05',
    maturityDate: '2023-12-05',
    lastActivityDate: '2023-06-05',
    notes: 'Six-month Treasury investment for excess liquidity'
  },
  {
    id: '5',
    accountNumber: '9988776655',
    accountName: 'Euro Operating Account',
    accountType: AccountType.CHECKING,
    status: AccountStatus.ACTIVE,
    currency: CurrencyType.EUR,
    balance: 125000.00,
    availableBalance: 125000.00,
    interestRate: 0.0,
    openDate: '2023-04-12',
    lastActivityDate: '2023-11-28',
    notes: 'Main operating account for European transactions'
  }
];

// Account store interface
interface AccountState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  
  // Actions
  addAccount: (account: Omit<Account, 'id' | 'accountNumber'>) => void;
  updateAccount: (account: Account) => void;
  deleteAccount: (id: string) => void;
  searchAccounts: (query: string) => Account[];
}

// Create the account store
export const useAccountStore = create<AccountState>(
  persist(
    (set, get) => ({
      accounts: sampleAccounts,
      loading: false,
      error: null,
      
      addAccount: (accountData) => {
        const newAccount: Account = {
          ...accountData,
          id: Date.now().toString(),
          accountNumber: generateAccountNumber(),
        };
        
        set((state) => ({
          accounts: [...state.accounts, newAccount],
        }));
      },
      
      updateAccount: (updatedAccount) => {
        set((state) => ({
          accounts: state.accounts.map((account) => 
            account.id === updatedAccount.id ? updatedAccount : account
          ),
        }));
      },
      
      deleteAccount: (id) => {
        set((state) => ({
          accounts: state.accounts.filter((account) => account.id !== id),
        }));
      },
      
      searchAccounts: (query) => {
        const { accounts } = get();
        const lowerCaseQuery = query.toLowerCase();
        
        return accounts.filter(
          (account) =>
            account.accountNumber.toLowerCase().includes(lowerCaseQuery) ||
            account.accountName.toLowerCase().includes(lowerCaseQuery) ||
            account.accountType.toLowerCase().includes(lowerCaseQuery) ||
            account.status.toLowerCase().includes(lowerCaseQuery) ||
            account.notes?.toLowerCase().includes(lowerCaseQuery)
        );
      },
    }),
    {
      name: 'prism-alm-accounts',
      partialize: (state) => ({ accounts: state.accounts }),
    }
  )
);
