import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Account, AccountType } from './accountStore';

export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum RiskCategory {
  CREDIT = 'Credit Risk',
  MARKET = 'Market Risk',
  LIQUIDITY = 'Liquidity Risk',
  OPERATIONAL = 'Operational Risk',
  INTEREST_RATE = 'Interest Rate Risk'
}

export interface RiskAssessment {
  id: string;
  accountId: string;
  category: RiskCategory;
  level: RiskLevel;
  score: number; // 0-100
  factors: string[];
  mitigationStrategies: string[];
  lastUpdated: string;
  nextReviewDate: string;
}

interface RiskMetrics {
  creditRiskScore: number;
  marketRiskScore: number;
  liquidityRiskScore: number;
  operationalRiskScore: number;
  interestRateRiskScore: number;
  overallRiskScore: number;
}

interface RiskState {
  assessments: RiskAssessment[];
  loading: boolean;
  error: string | null;

  // Actions
  calculateAccountRisk: (account: Account) => RiskAssessment[];
  calculatePortfolioRisk: (accounts: Account[]) => RiskMetrics;
  addAssessment: (assessment: Omit<RiskAssessment, 'id'>) => void;
  updateAssessment: (assessment: RiskAssessment) => void;
  getAccountAssessments: (accountId: string) => RiskAssessment[];
}

// Helper function to calculate credit risk
const calculateCreditRisk = (account: Account): number => {
  let score = 100;

  // Reduce score based on account type risk
  switch (account.accountType) {
    case AccountType.LOAN:
      score -= 20;
      break;
    case AccountType.MORTGAGE:
      score -= 15;
      break;
    case AccountType.CREDIT_LINE:
      score -= 10;
      break;
  }

  // Reduce score for negative balance
  if (account.balance < 0) {
    score -= 30;
  }

  // Reduce score for high loan amounts
  if (account.balance < -500000) {
    score -= 20;
  }

  return Math.max(0, score);
};

// Helper function to calculate liquidity risk
const calculateLiquidityRisk = (account: Account): number => {
  let score = 100;

  // Higher risk for long-term investments
  if (account.accountType === AccountType.INVESTMENT) {
    score -= 20;
  }

  // Higher risk for mortgages
  if (account.accountType === AccountType.MORTGAGE) {
    score -= 25;
  }

  // Lower risk for checking and savings
  if (account.accountType === AccountType.CHECKING || account.accountType === AccountType.SAVINGS) {
    score += 10;
  }

  // Consider available balance
  if (account.availableBalance && account.availableBalance < account.balance * 0.1) {
    score -= 30;
  }

  return Math.max(0, Math.min(100, score));
};

// Helper function to calculate interest rate risk
const calculateInterestRateRisk = (account: Account): number => {
  let score = 100;

  // Higher risk for fixed-rate accounts
  if (account.accountType === AccountType.MORTGAGE || account.accountType === AccountType.LOAN) {
    score -= 25;
  }

  // Consider interest rate level
  if (account.interestRate) {
    if (account.interestRate > 5) {
      score -= 20;
    } else if (account.interestRate > 3) {
      score -= 10;
    }
  }

  // Consider maturity date
  if (account.maturityDate) {
    const daysToMaturity = Math.ceil(
      (new Date(account.maturityDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysToMaturity > 365 * 5) { // More than 5 years
      score -= 30;
    } else if (daysToMaturity > 365) { // More than 1 year
      score -= 15;
    }
  }

  return Math.max(0, Math.min(100, score));
};

// Create the risk store
export const useRiskStore = create<RiskState>(
  persist(
    (set, get) => ({
      assessments: [],
      loading: false,
      error: null,

      calculateAccountRisk: (account) => {
        const creditRisk: RiskAssessment = {
          id: `${account.id}-credit-${Date.now()}`,
          accountId: account.id,
          category: RiskCategory.CREDIT,
          score: calculateCreditRisk(account),
          level: RiskLevel.MEDIUM,
          factors: [],
          mitigationStrategies: [],
          lastUpdated: new Date().toISOString(),
          nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
        };

        const liquidityRisk: RiskAssessment = {
          id: `${account.id}-liquidity-${Date.now()}`,
          accountId: account.id,
          category: RiskCategory.LIQUIDITY,
          score: calculateLiquidityRisk(account),
          level: RiskLevel.MEDIUM,
          factors: [],
          mitigationStrategies: [],
          lastUpdated: new Date().toISOString(),
          nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        };

        const interestRateRisk: RiskAssessment = {
          id: `${account.id}-interest-${Date.now()}`,
          accountId: account.id,
          category: RiskCategory.INTEREST_RATE,
          score: calculateInterestRateRisk(account),
          level: RiskLevel.MEDIUM,
          factors: [],
          mitigationStrategies: [],
          lastUpdated: new Date().toISOString(),
          nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        };

        // Update risk levels based on scores
        [creditRisk, liquidityRisk, interestRateRisk].forEach(risk => {
          if (risk.score >= 80) risk.level = RiskLevel.LOW;
          else if (risk.score >= 60) risk.level = RiskLevel.MEDIUM;
          else if (risk.score >= 40) risk.level = RiskLevel.HIGH;
          else risk.level = RiskLevel.CRITICAL;
        });

        // Add assessments to store
        set(state => ({
          assessments: [...state.assessments, creditRisk, liquidityRisk, interestRateRisk],
        }));

        return [creditRisk, liquidityRisk, interestRateRisk];
      },

      calculatePortfolioRisk: (accounts) => {
        const metrics: RiskMetrics = {
          creditRiskScore: 0,
          marketRiskScore: 0,
          liquidityRiskScore: 0,
          operationalRiskScore: 0,
          interestRateRiskScore: 0,
          overallRiskScore: 0,
        };

        accounts.forEach(account => {
          const risks = get().calculateAccountRisk(account);
          risks.forEach(risk => {
            switch (risk.category) {
              case RiskCategory.CREDIT:
                metrics.creditRiskScore += risk.score;
                break;
              case RiskCategory.LIQUIDITY:
                metrics.liquidityRiskScore += risk.score;
                break;
              case RiskCategory.INTEREST_RATE:
                metrics.interestRateRiskScore += risk.score;
                break;
            }
          });
        });

        // Calculate averages
        const numAccounts = accounts.length;
        if (numAccounts > 0) {
          metrics.creditRiskScore /= numAccounts;
          metrics.marketRiskScore /= numAccounts;
          metrics.liquidityRiskScore /= numAccounts;
          metrics.operationalRiskScore /= numAccounts;
          metrics.interestRateRiskScore /= numAccounts;
        }

        // Calculate overall risk score
        metrics.overallRiskScore = (
          metrics.creditRiskScore * 0.3 +
          metrics.marketRiskScore * 0.2 +
          metrics.liquidityRiskScore * 0.2 +
          metrics.operationalRiskScore * 0.1 +
          metrics.interestRateRiskScore * 0.2
        );

        return metrics;
      },

      addAssessment: (assessmentData) => {
        const newAssessment: RiskAssessment = {
          ...assessmentData,
          id: Date.now().toString(),
        };

        set(state => ({
          assessments: [...state.assessments, newAssessment],
        }));
      },

      updateAssessment: (updatedAssessment) => {
        set(state => ({
          assessments: state.assessments.map(assessment =>
            assessment.id === updatedAssessment.id ? updatedAssessment : assessment
          ),
        }));
      },

      getAccountAssessments: (accountId) => {
        const { assessments } = get();
        return assessments.filter(assessment => assessment.accountId === accountId);
      },
    }),
    {
      name: 'risk-store',
      partialize: (state) => ({
        assessments: state.assessments,
      }),
    }
  )
);
