import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthState, User, authService } from '@/services/AuthService';

interface AuthContextType extends AuthState {
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (userData: {
    username: string;
    email: string;
    displayName: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  updateSnapScore: (increment: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    // Initialize auth service
    authService.initialize();

    // Subscribe to auth state changes
    const unsubscribe = authService.subscribe((state) => {
      setAuthState(state);
    });

    return unsubscribe;
  }, []);

  const login = async (identifier: string, password: string) => {
    return await authService.login(identifier, password);
  };

  const register = async (userData: {
    username: string;
    email: string;
    displayName: string;
    password: string;
  }) => {
    return await authService.register(userData);
  };

  const logout = async () => {
    await authService.logout();
  };

  const updateProfile = async (updates: Partial<User>) => {
    return await authService.updateProfile(updates);
  };

  const updateSnapScore = async (increment: number) => {
    await authService.updateSnapScore(increment);
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    updateSnapScore,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
