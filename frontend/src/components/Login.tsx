// src/components/Login.tsx
// This component renders the login form for user authentication

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/auth';
// Import UI components from shadcn library
import { Button } from '../extensions/shadcn/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../extensions/shadcn/components/card';
import { Input } from '../extensions/shadcn/components/input';
import { Label } from '../extensions/shadcn/components/label';

export function Login() {
  // State variables for form inputs and UI state
  const [username, setUsername] = useState(''); // State for username input
  const [password, setPassword] = useState(''); // State for password input
  const [error, setError] = useState('');       // State for error messages
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate(); // Hook for programmatic navigation

  /**
   * Handle form submission
   * @param e - Form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Clear any existing errors
    setIsLoading(true); // Show loading state

    try {
      // Attempt to log in with provided credentials
      await login({ username, password });
      // If successful, navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      // If login fails, show error message
      setError('Invalid username or password');
      console.error('Login error:', err);
    } finally {
      // Always reset loading state when done
      setIsLoading(false);
    }
  };

  return (
    // Container with full height and centered content
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Card component for the login form */}
      <Card className="w-full max-w-md">
        {/* Card header with title and description */}
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login to ALM Dashboard</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the Asset Liability Management system
          </CardDescription>
        </CardHeader>
        {/* Card content containing the form */}
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              {/* Username input field */}
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)} // Update state on input change
                  required // Make field required
                />
              </div>
              {/* Password input field */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password" // Use password type to mask input
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Update state on input change
                  required // Make field required
                />
              </div>
              {/* Conditional error message display */}
              {error && <p className="text-sm text-red-500">{error}</p>}
              {/* Submit button with loading state */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
        </CardContent>
        {/* Card footer with demo credentials info */}
        <CardFooter className="flex flex-col">
          <p className="text-sm text-gray-500 text-center mt-2">
            Use 'admin' with password 'password' for demo access.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}