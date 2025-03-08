import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { DashboardCard } from '../components/DashboardCard';
import { useAccountStore } from '../utils/accountStore';
import { useRiskStore, RiskLevel, RiskCategory, RiskAssessment } from '../utils/riskStore';

export default function RiskAssessment() {
  const { accounts } = useAccountStore();
  const { calculatePortfolioRisk, calculateAccountRisk, getAccountAssessments } = useRiskStore();
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');

  // Calculate portfolio risk metrics
  const portfolioMetrics = calculatePortfolioRisk(accounts);

  // Get risk assessments for selected account
  const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);
  const accountAssessments = selectedAccount ? getAccountAssessments(selectedAccountId) : [];

  // Format risk score
  const formatRiskScore = (score: number) => {
    return score.toFixed(1);
  };

  // Get risk level color
  const getRiskLevelColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    if (score >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  // Get risk level text
  const getRiskLevelText = (score: number) => {
    if (score >= 80) return 'Low Risk';
    if (score >= 60) return 'Medium Risk';
    if (score >= 40) return 'High Risk';
    return 'Critical Risk';
  };

  return (
    <DashboardLayout title="Risk Assessment">
      <div className="space-y-6">
        {/* Portfolio Risk Overview */}
        <DashboardCard title="Portfolio Risk Overview" subtitle="Overall risk metrics for your portfolio">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Overall Risk Score */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Overall Risk Score</h3>
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskLevelColor(portfolioMetrics.overallRiskScore)}`}>
                  {formatRiskScore(portfolioMetrics.overallRiskScore)}
                </div>
                <span className="text-gray-600">{getRiskLevelText(portfolioMetrics.overallRiskScore)}</span>
              </div>
            </div>

            {/* Credit Risk */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Credit Risk</h3>
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskLevelColor(portfolioMetrics.creditRiskScore)}`}>
                  {formatRiskScore(portfolioMetrics.creditRiskScore)}
                </div>
                <span className="text-gray-600">{getRiskLevelText(portfolioMetrics.creditRiskScore)}</span>
              </div>
            </div>

            {/* Liquidity Risk */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Liquidity Risk</h3>
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskLevelColor(portfolioMetrics.liquidityRiskScore)}`}>
                  {formatRiskScore(portfolioMetrics.liquidityRiskScore)}
                </div>
                <span className="text-gray-600">{getRiskLevelText(portfolioMetrics.liquidityRiskScore)}</span>
              </div>
            </div>

            {/* Interest Rate Risk */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Interest Rate Risk</h3>
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskLevelColor(portfolioMetrics.interestRateRiskScore)}`}>
                  {formatRiskScore(portfolioMetrics.interestRateRiskScore)}
                </div>
                <span className="text-gray-600">{getRiskLevelText(portfolioMetrics.interestRateRiskScore)}</span>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Account Risk Assessment */}
        <DashboardCard title="Account Risk Assessment" subtitle="Detailed risk analysis for individual accounts">
          <div className="space-y-6">
            {/* Account Selection */}
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Account
              </label>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
                value={selectedAccountId}
                onChange={(e) => {
                  setSelectedAccountId(e.target.value);
                  if (e.target.value) {
                    const account = accounts.find(acc => acc.id === e.target.value);
                    if (account) {
                      calculateAccountRisk(account);
                    }
                  }
                }}
              >
                <option value="">Select an account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountName} ({account.accountType})
                  </option>
                ))}
              </select>
            </div>

            {/* Risk Assessment Details */}
            {selectedAccount && (
              <div className="space-y-4">
                {accountAssessments.map((assessment) => (
                  <div key={assessment.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{assessment.category}</h3>
                        <p className="text-sm text-gray-500">Last updated: {new Date(assessment.lastUpdated).toLocaleDateString()}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskLevelColor(assessment.score)}`}>
                        {formatRiskScore(assessment.score)} - {assessment.level}
                      </div>
                    </div>

                    {assessment.factors.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700">Risk Factors</h4>
                        <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                          {assessment.factors.map((factor, index) => (
                            <li key={index}>{factor}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {assessment.mitigationStrategies.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700">Mitigation Strategies</h4>
                        <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                          {assessment.mitigationStrategies.map((strategy, index) => (
                            <li key={index}>{strategy}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-4 text-sm text-gray-500">
                      Next review date: {new Date(assessment.nextReviewDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
}
