import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "./Button";
import { useAuthStore } from "../utils/auth";
import { Toaster } from "sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Navigation items
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "Account Management", path: "/account-management", icon: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { name: "Risk Assessment", path: "/risk-assessment", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { name: "Transactions", path: "/transactions", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { name: "Compliance", path: "/compliance", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" }
  ];

  // Get current path
  const currentPath = window.location.pathname;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Toaster position="top-right" richColors />
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <div className="text-xl font-semibold text-primary">Prism ALM</div>
        </div>
        <nav className="mt-5 px-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md mb-1 ${currentPath === item.path ? 'text-primary bg-primary/10' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <svg
                className={`mr-3 h-6 w-6 ${currentPath === item.path ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col lg:w-64 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <div className="text-xl font-semibold text-primary">Prism ALM</div>
        </div>
        <nav className="mt-5 px-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md mb-1 ${currentPath === item.path ? 'text-primary bg-primary/10' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <svg
                className={`mr-3 h-5 w-5 ${currentPath === item.path ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          
          {/* Page title */}
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          
          {/* User profile and logout */}
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-700">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.institution}</div>
              </div>
              <div className="ml-4">
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}