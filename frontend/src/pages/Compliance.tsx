import React, { useEffect } from "react";
import { useAuthStore } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import { DashboardCard } from "../components/DashboardCard";

export default function Compliance() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <DashboardLayout title="Compliance Monitoring">
      <div className="grid grid-cols-1 gap-6">
        <DashboardCard
          title="Compliance Center"
          subtitle="Monitor regulatory compliance and requirements"
        >
          <div className="p-4 bg-primary/5 rounded-md text-center">
            <p className="text-gray-700 mb-4">
              This section will contain compliance monitoring tools including regulatory requirement tracking, 
              compliance reporting, audit logs, and document management for regulatory submissions.
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
