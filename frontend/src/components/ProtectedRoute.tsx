import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../utils/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to the login page, but save the current location they were
    // trying to go to so we can send them there after they login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
