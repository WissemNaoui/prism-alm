// src/utils/auth.ts
import { create } from 'zustand';

// Type definition for login credentials
interface LoginCredentials {
  email: string;
  password: string;
}

// Type definition for the token response from the API
interface TokenResponse {
  access_token: string;  // JWT token for authentication
  token_type: string;    // Token type (usually "bearer")
}

// Type definition for user data
interface User {
  email: string;        // User's email
  full_name: string;    // User's full name
  is_active: boolean;   // Whether the user account is active
}

// Type definition for auth store state
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getUser: () => Promise<void>;
}

// Get API URL from environment variables or use localhost default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create auth store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // Create form data in the format expected by OAuth2 password flow
      const formData = new URLSearchParams();
      formData.append('username', email); // Using email as username
      formData.append('password', password);

      // Make POST request to the login endpoint
      const response = await fetch(`${API_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data: TokenResponse = await response.json();
      localStorage.setItem('token', data.access_token);
      set({ isAuthenticated: true, error: null });

      // Get user data after successful login
      const userResponse = await fetch(`${API_URL}/auth/users/me`, {
        headers: {
          'Authorization': `Bearer ${data.access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData: User = await userResponse.json();
      set({ user: userData });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
      throw error; // Re-throw the error so the component can handle it
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },

  getUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, isAuthenticated: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/auth/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          set({ user: null, isAuthenticated: false });
          throw new Error('Authentication token expired');
        }
        throw new Error('Failed to fetch user data');
      }

      const userData: User = await response.json();
      set({ user: userData, isAuthenticated: true });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));