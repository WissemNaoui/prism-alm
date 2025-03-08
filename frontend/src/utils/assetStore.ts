import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum AssetType {
  CASH = 'Cash',
  BONDS = 'Bonds',
  STOCKS = 'Stocks',
  REAL_ESTATE = 'Real Estate',
  COMMODITIES = 'Commodities',
  OTHER = 'Other'
}

export enum AssetStatus {
  ACTIVE = 'Active',
  PENDING = 'Pending',
  MATURED = 'Matured',
  SOLD = 'Sold'
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  currency: string;
  maturityDate?: string;
  interestRate?: number;
  yield?: number;
  risk?: number;
  location?: string;
  description?: string;
  tags: string[];
  lastValuationDate: string;
}

export interface AssetPerformance {
  totalReturn: number;
  annualizedReturn: number;
  unrealizedGains: number;
  realizedGains: number;
  valueHistory: { date: string; value: number }[];
}

interface AssetPortfolio {
  totalValue: number;
  assetAllocation: Record<AssetType, number>;
  performanceMetrics: AssetPerformance;
}

interface AssetState {
  assets: Asset[];
  loading: boolean;
  error: string | null;

  // Asset Management
  addAsset: (asset: Omit<Asset, 'id'>) => void;
  updateAsset: (asset: Asset) => void;
  deleteAsset: (id: string) => void;
  getAssetById: (id: string) => Asset | undefined;
  getAssetsByType: (type: AssetType) => Asset[];

  // Portfolio Analysis
  calculatePortfolioMetrics: () => AssetPortfolio;
  calculateAssetPerformance: (assetId: string) => AssetPerformance;
  getAssetAllocation: () => Record<AssetType, number>;
  
  // Valuation
  updateAssetValue: (id: string, newValue: number) => void;
  calculateTotalValue: () => number;
}

export const useAssetStore = create<AssetState>(
  persist(
    (set, get) => ({
      assets: [],
      loading: false,
      error: null,

      addAsset: (assetData) => {
        const newAsset: Asset = {
          ...assetData,
          id: Date.now().toString(),
        };
        set((state) => ({
          assets: [...state.assets, newAsset],
        }));
      },

      updateAsset: (updatedAsset) => {
        set((state) => ({
          assets: state.assets.map((asset) =>
            asset.id === updatedAsset.id ? updatedAsset : asset
          ),
        }));
      },

      deleteAsset: (id) => {
        set((state) => ({
          assets: state.assets.filter((asset) => asset.id !== id),
        }));
      },

      getAssetById: (id) => {
        return get().assets.find((asset) => asset.id === id);
      },

      getAssetsByType: (type) => {
        return get().assets.filter((asset) => asset.type === type);
      },

      calculatePortfolioMetrics: () => {
        const assets = get().assets;
        const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
        
        // Calculate asset allocation
        const assetAllocation = assets.reduce((allocation, asset) => {
          allocation[asset.type] = (allocation[asset.type] || 0) + (asset.currentValue / totalValue) * 100;
          return allocation;
        }, {} as Record<AssetType, number>);

        // Calculate performance metrics
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        
        const performanceMetrics: AssetPerformance = {
          totalReturn: 0,
          annualizedReturn: 0,
          unrealizedGains: 0,
          realizedGains: 0,
          valueHistory: []
        };

        // Calculate total return and unrealized gains
        assets.forEach(asset => {
          const gain = asset.currentValue - asset.purchasePrice;
          performanceMetrics.unrealizedGains += gain;
          
          const purchaseDate = new Date(asset.purchaseDate);
          const holdingPeriod = (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
          const assetReturn = (asset.currentValue / asset.purchasePrice - 1) * 100;
          performanceMetrics.annualizedReturn += assetReturn / holdingPeriod;
        });

        performanceMetrics.totalReturn = (performanceMetrics.unrealizedGains / totalValue) * 100;
        performanceMetrics.annualizedReturn /= assets.length;

        return {
          totalValue,
          assetAllocation,
          performanceMetrics
        };
      },

      calculateAssetPerformance: (assetId) => {
        const asset = get().getAssetById(assetId);
        if (!asset) {
          return {
            totalReturn: 0,
            annualizedReturn: 0,
            unrealizedGains: 0,
            realizedGains: 0,
            valueHistory: []
          };
        }

        const unrealizedGains = asset.currentValue - asset.purchasePrice;
        const totalReturn = (unrealizedGains / asset.purchasePrice) * 100;

        const purchaseDate = new Date(asset.purchaseDate);
        const now = new Date();
        const holdingPeriod = (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
        const annualizedReturn = totalReturn / holdingPeriod;

        return {
          totalReturn,
          annualizedReturn,
          unrealizedGains,
          realizedGains: 0, // This would be calculated from transaction history
          valueHistory: [] // This would be populated from historical data
        };
      },

      getAssetAllocation: () => {
        const { assets } = get();
        const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
        
        return assets.reduce((allocation, asset) => {
          allocation[asset.type] = (allocation[asset.type] || 0) + (asset.currentValue / totalValue) * 100;
          return allocation;
        }, {} as Record<AssetType, number>);
      },

      updateAssetValue: (id, newValue) => {
        set((state) => ({
          assets: state.assets.map((asset) =>
            asset.id === id
              ? {
                  ...asset,
                  currentValue: newValue,
                  lastValuationDate: new Date().toISOString(),
                }
              : asset
          ),
        }));
      },

      calculateTotalValue: () => {
        return get().assets.reduce((sum, asset) => sum + asset.currentValue, 0);
      },
    }),
    {
      name: 'asset-store',
      partialize: (state) => ({
        assets: state.assets,
      }),
    }
  )
);
