// src/components/Dashboard.tsx
// This component renders the main dashboard for the Asset-Liability Management system

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../extensions/shadcn/components/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../extensions/shadcn/components/tabs';
import { getUser, isAuthenticated } from '../utils/auth';

// Type definitions for API data
// Interface for risk assessment data
interface RiskAssessment {
  risk_type: string;       // Type of risk (liquidity, interest_rate, etc.)
  risk_score: number;      // Risk score value (0-100)
  analysis_date: string;   // Date of analysis (ISO format)
  description: string;     // Description of the risk assessment
  recommendations: string[]; // List of recommendations
}

// Interface for stress test result data
interface StressTestResult {
  id: number;              // Unique identifier
  scenario_name: string;   // Name of the stress test scenario
  execution_date: string;  // Date of test execution (ISO format)
  risk_type: string;       // Type of risk (liquidity, interest_rate, etc.)
  impact_level: number;    // Impact level (0-100)
  description: string;     // Description of the stress test
  actions_recommended: string[]; // List of recommended actions
}

// Interface for gap analysis result data
interface GapAnalysisResult {
  id: number;              // Unique identifier
  analysis_date: string;   // Date of analysis (ISO format)
  period: string;          // Time period (e.g., "1M", "3M", "6M", "1Y")
  assets: number;          // Value of assets
  liabilities: number;     // Value of liabilities
  gap: number;             // Difference between assets and liabilities
  relative_gap: number;    // Gap as a percentage of assets
  description?: string;    // Optional description of the gap analysis
}

// Interface for combined dashboard data
interface DashboardData {
  current_risk_assessment: RiskAssessment[];  // List of risk assessments
  recent_stress_tests: StressTestResult[];    // List of stress tests
  gap_analysis: GapAnalysisResult[];          // List of gap analyses
}

// Get API URL from environment variables or use localhost default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function Dashboard() {
  // State for user data
  const [user, setUser] = useState<{ username: string } | null>(null);
  // State for loading indicator
  const [loading, setLoading] = useState(true);
  // State for error messages
  const [error, setError] = useState<string | null>(null);
  // State for dashboard data from API
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Effect hook to check authentication and load data on component mount
  useEffect(() => {
    const checkAuth = async () => {
      // If not authenticated, redirect to login page
      if (!isAuthenticated()) {
        navigate('/login');
        return;
      }

      try {
        // Fetch user data
        const userData = await getUser();
        setUser(userData);
        // Fetch dashboard data
        await fetchDashboardData();
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
        navigate('/login'); // Redirect on error
      } finally {
        // Set loading to false when done
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]); // Re-run if navigate function changes

  /**
   * Fetch dashboard data from the API
   */
  const fetchDashboardData = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      // Fetch dashboard data with authentication
      const response = await fetch(`${API_URL}/alm/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include token for authentication
        },
      });

      // Handle unsuccessful response
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      // Parse response and update state
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    }
  };

  // Show loading indicator when data is being fetched
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Show error message if there's an error
  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Dashboard header */}
      <h1 className="text-3xl font-bold mb-6">Asset-Liability Management Dashboard</h1>
      <p className="mb-8">Welcome, <span className="font-semibold">{user?.username}</span></p>

      {dashboardData ? (
        // Tabbed interface for different data sections
        <Tabs defaultValue="risk" className="w-full">
          {/* Tab navigation */}
          <TabsList className="mb-4">
            <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
            <TabsTrigger value="stress">Stress Tests</TabsTrigger>
            <TabsTrigger value="gap">Gap Analysis</TabsTrigger>
          </TabsList>

          {/* Risk Assessment Tab Content */}
          <TabsContent value="risk">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Map through risk assessments to create cards */}
              {dashboardData.current_risk_assessment.map((assessment, index) => (
                <Card key={index} className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {/* Capitalize the first letter of risk type */}
                      <span>{assessment.risk_type.charAt(0).toUpperCase() + assessment.risk_type.slice(1)} Risk</span>
                      {/* Display risk score with one decimal place */}
                      <span className="text-lg font-medium">
                        Score: {assessment.risk_score.toFixed(1)}
                      </span>
                    </CardTitle>
                    <CardDescription>
                      {/* Format the date for display */}
                      Analyzed on {new Date(assessment.analysis_date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Description of the risk assessment */}
                    <p className="mb-4">{assessment.description}</p>
                    <div>
                      <h4 className="font-medium mb-2">Recommendations:</h4>
                      {/* List of recommendations */}
                      <ul className="list-disc pl-5">
                        {assessment.recommendations.map((rec, i) => (
                          <li key={i} className="mb-1">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Stress Tests Tab Content */}
          <TabsContent value="stress">
            <div className="space-y-6">
              {/* Map through stress tests to create cards */}
              {dashboardData.recent_stress_tests.map((test) => (
                <Card key={test.id} className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {/* Stress test scenario name */}
                      <span>{test.scenario_name}</span>
                      {/* Impact level with one decimal place */}
                      <span className="text-lg font-medium">
                        Impact: {test.impact_level.toFixed(1)}
                      </span>
                    </CardTitle>
                    <CardDescription>
                      {/* Format risk type and date for display */}
                      {test.risk_type.charAt(0).toUpperCase() + test.risk_type.slice(1)} Risk | 
                      Executed on {new Date(test.execution_date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Description of the stress test */}
                    <p className="mb-4">{test.description}</p>
                    <div>
                      <h4 className="font-medium mb-2">Recommended Actions:</h4>
                      {/* List of recommended actions */}
                      <ul className="list-disc pl-5">
                        {test.actions_recommended.map((action, i) => (
                          <li key={i} className="mb-1">{action}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Gap Analysis Tab Content */}
          <TabsContent value="gap">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Gap Analysis Results</CardTitle>
                <CardDescription>
                  {/* Display analysis date if available */}
                  Analysis Date: {dashboardData.gap_analysis.length > 0 ? 
                    new Date(dashboardData.gap_analysis[0].analysis_date).toLocaleDateString() : 'N/A'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Table with horizontal scrolling for small screens */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        {/* Table headers */}
                        <th className="border px-4 py-2 text-left">Period</th>
                        <th className="border px-4 py-2 text-right">Assets (₩M)</th>
                        <th className="border px-4 py-2 text-right">Liabilities (₩M)</th>
                        <th className="border px-4 py-2 text-right">Gap (₩M)</th>
                        <th className="border px-4 py-2 text-right">Relative Gap (%)</th>
                        <th className="border px-4 py-2 text-left">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Map through gap analysis results to create table rows */}
                      {dashboardData.gap_analysis.map((gap) => (
                        <tr key={gap.id} className="hover:bg-gray-50">
                          {/* Time period */}
                          <td className="border px-4 py-2">{gap.period}</td>
                          {/* Assets value in millions */}
                          <td className="border px-4 py-2 text-right">
                            {(gap.assets / 1000000).toFixed(2)}
                          </td>
                          {/* Liabilities value in millions */}
                          <td className="border px-4 py-2 text-right">
                            {(gap.liabilities / 1000000).toFixed(2)}
                          </td>
                          {/* Gap value with color coding (red for negative, green for positive) */}
                          <td className={`border px-4 py-2 text-right ${gap.gap < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {(gap.gap / 1000000).toFixed(2)}
                          </td>
                          {/* Relative gap as percentage with color coding */}
                          <td className={`border px-4 py-2 text-right ${gap.relative_gap < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {(gap.relative_gap * 100).toFixed(2)}%
                          </td>
                          {/* Notes or description, if available */}
                          <td className="border px-4 py-2">{gap.description || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        // Fallback message if no data is available
        <div className="text-center py-12">No dashboard data available</div>
      )}
    </div>
  );
}