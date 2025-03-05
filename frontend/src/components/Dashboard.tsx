
import React, { useState, useEffect } from 'react';
import { getAuthHeaders } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../utils/auth';

// Mock data for demo purposes
const mockRiskMetrics = [
  { id: 1, name: 'Liquidity Coverage Ratio', value: 125, target: 100, unit: '%', status: 'good' },
  { id: 2, name: 'Net Stable Funding Ratio', value: 110, target: 100, unit: '%', status: 'good' },
  { id: 3, name: 'Interest Rate Risk (EVE)', value: 12, target: 15, unit: '%', status: 'warning' },
  { id: 4, name: 'Concentration Risk (HHI)', value: 0.18, target: 0.15, unit: 'index', status: 'bad' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // In a real app, you would fetch data from your backend here
    setIsLoading(true);
    
    const fetchDashboardData = async () => {
      try {
        // Example API call (commented out for demo)
        /*
        const response = await fetch('/api/alm/dashboard', {
          headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        // Process and set data
        */
        
        // Simulate API delay
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {mockRiskMetrics.map((metric) => (
              <div key={metric.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">{metric.name}</h3>
                <div className="mt-1 flex items-baseline justify-between">
                  <div className="flex items-baseline">
                    <p className={`text-2xl font-semibold ${
                      metric.status === 'good' ? 'text-green-600' : 
                      metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {metric.value}{metric.unit}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Target: {metric.target}{metric.unit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'gap-analysis':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Gap Analysis</h3>
            <p className="text-gray-500 mb-4">Select parameters to perform gap analysis</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Analysis Type</label>
                <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                  <option>Static Gap</option>
                  <option>Dynamic Gap</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">As of Date</label>
                <input type="date" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Buckets</label>
                <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                  <option>Standard</option>
                  <option>Custom</option>
                </select>
              </div>
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md">
              Run Analysis
            </button>
          </div>
        );
      case 'stress-tests':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Stress Testing</h3>
            <p className="text-gray-500 mb-4">Run predefined stress test scenarios</p>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-md p-4">
                <h4 className="text-md font-medium">Interest Rate Shock +200bp</h4>
                <p className="text-sm text-gray-500 mt-1">Parallel shift of interest rate curve by +200 basis points</p>
                <button className="mt-2 bg-indigo-600 text-white px-3 py-1 text-sm rounded-md">
                  Run Scenario
                </button>
              </div>
              <div className="border border-gray-200 rounded-md p-4">
                <h4 className="text-md font-medium">Liquidity Stress - Market Crisis</h4>
                <p className="text-sm text-gray-500 mt-1">Severe market conditions causing liquidity shortage</p>
                <button className="mt-2 bg-indigo-600 text-white px-3 py-1 text-sm rounded-md">
                  Run Scenario
                </button>
              </div>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Regulatory Reports</h3>
            <p className="text-gray-500 mb-4">Generate regulatory and ALCO reports</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-md p-4">
                <h4 className="text-md font-medium">Basel III Compliance Report</h4>
                <div className="mt-2 flex">
                  <button className="bg-indigo-600 text-white px-3 py-1 text-sm rounded-md mr-2">
                    Generate PDF
                  </button>
                  <button className="bg-green-600 text-white px-3 py-1 text-sm rounded-md">
                    Generate Excel
                  </button>
                </div>
              </div>
              <div className="border border-gray-200 rounded-md p-4">
                <h4 className="text-md font-medium">ALCO Monthly Report</h4>
                <div className="mt-2 flex">
                  <button className="bg-indigo-600 text-white px-3 py-1 text-sm rounded-md mr-2">
                    Generate PDF
                  </button>
                  <button className="bg-green-600 text-white px-3 py-1 text-sm rounded-md">
                    Generate Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>No content available</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-600">BTE ALM</span>
              </div>
            </div>
            <div className="flex items-center">
              <button 
                onClick={handleLogout}
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Asset Liability Management Dashboard</h1>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`${
                    activeTab === 'overview'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('gap-analysis')}
                  className={`${
                    activeTab === 'gap-analysis'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                >
                  Gap Analysis
                </button>
                <button
                  onClick={() => setActiveTab('stress-tests')}
                  className={`${
                    activeTab === 'stress-tests'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                >
                  Stress Tests
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`${
                    activeTab === 'reports'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                >
                  Reports
                </button>
              </nav>
            </div>
            <div className="p-4">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
