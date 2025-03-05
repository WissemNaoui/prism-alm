import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  institution: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, institution: string, password: string) => Promise<void>;
  logout: () => void;
}

// For development, we'll use a simple predefined user list
const USERS_STORAGE_KEY = 'prism_alm_users';

interface StoredUser extends User {
  password: string;
}

// Helper functions for local user management
const getStoredUsers = (): StoredUser[] => {
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

const saveUser = (user: StoredUser): void => {
  const users = getStoredUsers();
  const existingUserIndex = users.findIndex(u => u.email === user.email);
  
  if (existingUserIndex >= 0) {
    users[existingUserIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const findUserByEmail = (email: string): StoredUser | undefined => {
  const users = getStoredUsers();
  return users.find(user => user.email === email);
};

export const useAuthStore = create<AuthState>(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const user = findUserByEmail(email);
          
          if (!user || user.password !== password) {
            throw new Error('Invalid email or password');
          }
          
          const { password: _, ...userWithoutPassword } = user;
          
          set({
            isLoading: false,
            isAuthenticated: true,
            user: userWithoutPassword,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
          });
          throw error;
        }
      },
      
      signup: async (name, email, institution, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const existingUser = findUserByEmail(email);
          
          if (existingUser) {
            throw new Error('User with this email already exists');
          }
          
          const newUser: StoredUser = {
            id: `user-${Date.now()}`,
            name,
            email,
            institution,
            password,
          };
          
          saveUser(newUser);
          
          const { password: _, ...userWithoutPassword } = newUser;
          
          set({
            isLoading: false,
            isAuthenticated: true,
            user: userWithoutPassword,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
          });
          throw error;
        }
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },
    }),
    {
      name: 'prism-alm-auth',
      // Only store non-sensitive info in localStorage
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
