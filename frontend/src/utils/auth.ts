// src/utils/auth.ts
// This file contains authentication-related utility functions for the frontend

// Type definition for login credentials
interface LoginCredentials {
  username: string;
  password: string;
}

// Type definition for the token response from the API
interface TokenResponse {
  access_token: string;  // JWT token for authentication
  token_type: string;    // Token type (usually "bearer")
}

// Type definition for user data
interface User {
  username: string;     // User's username
  email: string;        // User's email
  full_name: string;    // User's full name
  is_active: boolean;   // Whether the user account is active
}

// Get API URL from environment variables or use localhost default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Login function - sends credentials to the API and returns a token
 * 
 * @param credentials - Object containing username and password
 * @returns Promise resolving to token response
 * @throws Error if login fails
 */
export const login = async (credentials: LoginCredentials): Promise<TokenResponse> => {
  // Create form data in the format expected by OAuth2 password flow
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  // Make POST request to the login endpoint
  const response = await fetch(`${API_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded', // Required for OAuth2 password flow
    },
    body: formData.toString(),
  });

  // Handle error response
  if (!response.ok) {
    throw new Error('Login failed');
  }

  // Parse response JSON
  const data: TokenResponse = await response.json();

  // Store token in browser's localStorage for persistent sessions
  localStorage.setItem('token', data.access_token);

  return data;
};

/**
 * Get current user data from the API
 * 
 * @returns Promise resolving to user data
 * @throws Error if not authenticated or fetch fails
 */
export const getUser = async (): Promise<User> => {
  // Get token from localStorage
  const token = localStorage.getItem('token');

  // Check if token exists
  if (!token) {
    throw new Error('No authentication token found');
  }

  // Make request to get user data with the token
  const response = await fetch(`${API_URL}/auth/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`, // Include token in Authorization header
    },
  });

  // Handle errors
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid - clear it
      localStorage.removeItem('token');
      throw new Error('Authentication token expired');
    }
    throw new Error('Failed to fetch user data');
  }

  // Parse and return user data
  return await response.json();
};

/**
 * Check if user is authenticated by verifying token existence
 * 
 * @returns boolean indicating whether user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('token') !== null;
};

/**
 * Logout the user by removing the token
 */
export const logout = (): void => {
  localStorage.removeItem('token');
};