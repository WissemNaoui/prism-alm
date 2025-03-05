// src/App.tsx
// Main application component that sets up routing

import React from 'react';
// Import routing components from react-router-dom
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// Import application components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
// Import authentication utility
// import { isAuthenticated } from './utils/auth'; //This line is commented out because it's not used in this version.  It was likely present in a previous iteration.

/**
 * Protected route wrapper component
 * 
 * This component checks if the user is authenticated before rendering its children.
 * If not authenticated, it redirects to the login page.  In a real application, this would likely check a token or session storage.
 * 
 * @param children - The components to render if authenticated
 */
const ProtectedRoute = ({ children }) => {
  // Placeholder for authentication check - replace with actual authentication logic
  const isAuthenticated = true; // Replace with actual authentication check

  // Check if user is authenticated
  return isAuthenticated ? (
    // If authenticated, render the children
    <>{children}</>
  ) : (
    // If not authenticated, redirect to login
    <Navigate to="/login" />
  );
};

/**
 * Main App component
 * 
 * Sets up the routing configuration for the application
 */
function App() {
  return (
    // Router component wraps the entire application for routing
    <Router>
      {/* Routes define the application's navigation structure */}
      <Routes>
        {/* Login page route */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard route - protected by authentication check */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Redirect to dashboard if no route matches */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;