import React, { useEffect } from "react";
import { useAuthStore } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import { DashboardCard } from "../components/DashboardCard";

export default function Dashboard() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
  };

  return (
    <DashboardLayout title="Dashboard Overview">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Summary Cards */}
        <DashboardCard
          title="Accounts"
          subtitle="Active account summary"
          className="col-span-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-semibold text-gray-900">24</p>
              <p className="text-sm text-gray-500">Total Accounts</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Risk Score"
          subtitle="Overall portfolio risk"
          className="col-span-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-semibold text-primary">Medium</p>
              <p className="text-sm text-gray-500">3.4 / 10</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Transactions"
          subtitle="Last 30 days"
          className="col-span-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-semibold text-gray-900">145</p>
              <p className="text-sm text-gray-500">+5.2% from last month</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Welcome Card */}
      <div className="mt-6">
        <DashboardCard
          title={`Welcome, ${user?.name}!`}
          subtitle={user?.institution}
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              Welcome to your Prism ALM dashboard. This dashboard provides an overview of your financial institution's asset-liability management.
            </p>
            <div className="bg-primary/5 p-4 rounded-md">
              <h4 className="font-medium text-primary mb-2">Quick navigation:</h4>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Link to="/account-management" className="flex items-center p-3 bg-white rounded-md shadow-sm border border-gray-200 hover:border-primary transition-colors">
                  <svg className="h-5 w-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">Accounts</span>
                </Link>
                <Link to="/risk-assessment" className="flex items-center p-3 bg-white rounded-md shadow-sm border border-gray-200 hover:border-primary transition-colors">
                  <svg className="h-5 w-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm">Risk</span>
                </Link>
                <Link to="/transactions" className="flex items-center p-3 bg-white rounded-md shadow-sm border border-gray-200 hover:border-primary transition-colors">
                  <svg className="h-5 w-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">Transactions</span>
                </Link>
                <Link to="/compliance" className="flex items-center p-3 bg-white rounded-md shadow-sm border border-gray-200 hover:border-primary transition-colors">
                  <svg className="h-5 w-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span className="text-sm">Compliance</span>
                </Link>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-900 mb-2">Your profile information:</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
                <li className="flex items-center">
                  <span className="font-medium mr-2">Name:</span> {user?.name}
                </li>
                <li className="flex items-center">
                  <span className="font-medium mr-2">Email:</span> {user?.email}
                </li>
                <li className="flex items-center">
                  <span className="font-medium mr-2">Institution:</span> {user?.institution}
                </li>
              </ul>
            </div>
          </div>
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
}
