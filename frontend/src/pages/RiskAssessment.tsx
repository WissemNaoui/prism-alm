import React, { useEffect } from "react";
import { useAuthStore } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import { DashboardCard } from "../components/DashboardCard";

export default function RiskAssessment() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <DashboardLayout title="Risk Assessment">
      <div className="grid grid-cols-1 gap-6">
        <DashboardCard
          title="Risk Overview"
          subtitle="Evaluate portfolio risk and exposures"
        >
          <div className="p-4 bg-primary/5 rounded-md text-center">
            <p className="text-gray-700 mb-4">
              This section will contain risk assessment tools including risk scoring, 
              stress testing, scenario analysis, and risk reporting features.
            </p>
            <p className="text-sm text-gray-500">
              Coming soon in future updates.
            </p>
          </div>
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
}
