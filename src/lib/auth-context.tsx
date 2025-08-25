'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials, LoginResponse } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          localStorage.removeItem('user');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Demo login - in real app this would be an API call
        console.log('Checking credentials:', credentials);
        if (credentials.email === 'demo@vanhaaster.nl' && credentials.password === 'SdfnjSDF432!') {
          console.log('Credentials match! Creating user...');
          const user: User = {
            id: '1',
            email: credentials.email,
            name: 'Demo Gebruiker',
          };

          localStorage.setItem('user', JSON.stringify(user));
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          console.log('User authenticated, state updated');
          resolve({ success: true, user });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
          resolve({ 
            success: false, 
            error: 'Ongeldig e-mailadres of wachtwoord' 
          });
        }
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
