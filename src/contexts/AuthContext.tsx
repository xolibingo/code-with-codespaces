import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getCurrentUser, clearCurrentUser } from '../lib/storage';
import { login as authLogin, signup as authSignup, googleSignIn as authGoogleSignIn } from '../lib/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    country: string;
    referredBy?: string;
  }) => Promise<User>;
  googleSignIn: () => Promise<User>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = getCurrentUser();
    if (stored) {
      // Ensure admin email always has admin role
      if (stored.email.toLowerCase() === 'bingosamu@gmail.com' && stored.role !== 'admin') {
        setUser({ ...stored, role: 'admin' });
      } else {
        setUser(stored);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const result = authLogin(email, password);
    if (!result) throw new Error('Invalid email or password');
    setUser(result);
    return result;
  };

  const logout = () => {
    clearCurrentUser();
    setUser(null);
  };

  const signup = async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    country: string;
    referredBy?: string;
  }): Promise<User> => {
    const result = authSignup(data);
    setUser(result);
    return result;
  };

  const googleSignIn = async (): Promise<User> => {
    const result = authGoogleSignIn();
    setUser(result);
    return result;
  };

  const refreshUser = () => {
    const stored = getCurrentUser();
    if (stored) setUser(stored);
  };

  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase() === 'bingosamu@gmail.com';

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin,
      login,
      logout,
      signup,
      googleSignIn,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
