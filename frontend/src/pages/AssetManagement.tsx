import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { DashboardCard } from '../components/DashboardCard';
import { useAssetStore, Asset, AssetType, AssetStatus } from '../utils/assetStore';

export default function AssetManagement() {
  const {
    assets,
    addAsset,
    updateAsset,
    deleteAsset,
    calculatePortfolioMetrics,
    calculateAssetPerformance,
  } = useAssetStore();

  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const portfolioMetrics = calculatePortfolioMetrics();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getAssetStatusColor = (status: AssetStatus) => {
    switch (status) {
      case AssetStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case AssetStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case AssetStatus.MATURED:
        return 'bg-blue-100 text-blue-800';
      case AssetStatus.SOLD:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout title="Asset Management">
      <div className="space-y-6">
        {/* Portfolio Overview */}
        <DashboardCard title="Portfolio Overview" subtitle="Key portfolio metrics and performance">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Total Portfolio Value</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {formatCurrency(portfolioMetrics.totalValue)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Total Return</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {formatPercentage(portfolioMetrics.performanceMetrics.totalReturn)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Annualized Return</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {formatPercentage(portfolioMetrics.performanceMetrics.annualizedReturn)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Unrealized Gains</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {formatCurrency(portfolioMetrics.performanceMetrics.unrealizedGains)}
              </p>
            </div>
          </div>
        </DashboardCard>

        {/* Asset Allocation */}
        <DashboardCard title="Asset Allocation" subtitle="Portfolio distribution by asset type">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {Object.entries(portfolioMetrics.assetAllocation).map(([type, percentage]) => (
                <div key={type} className="flex items-center">
                  <div className="w-32 text-sm text-gray-500">{type}</div>
                  <div className="flex-1">
                    <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="absolute h-full bg-primary rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-right text-sm text-gray-900">
                    {formatPercentage(percentage)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>

        {/* Asset List */}
        <DashboardCard
          title="Asset List"
          subtitle="Manage your portfolio assets"
          action={
            <button
              onClick={() => setShowAddAssetModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Add Asset
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asset Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purchase Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Return
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assets.map((asset) => {
                  const performance = calculateAssetPerformance(asset.id);
                  return (
                    <tr key={asset.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{asset.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getAssetStatusColor(
                            asset.status
                          )}`}
                        >
                          {asset.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(asset.purchasePrice)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(asset.currentValue)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm ${
                            performance.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {formatPercentage(performance.totalReturn)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedAsset(asset)}
                          className="text-primary hover:text-primary/80 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteAsset(asset.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </div>

      {/* Add/Edit Asset Modal would go here */}
    </DashboardLayout>
  );
}
