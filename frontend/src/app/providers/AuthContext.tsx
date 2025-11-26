"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'; 

// 백엔드 User Entity를 기반으로 타입 정의
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  fetchUserProfile: (authToken: string) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'userProfile';
const API_BASE_URL = 'http://localhost:3001'; 

const saveAuthData = (token: string, user: User) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUserProfile = async (authToken: string): Promise<User | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      
      const userData: User = response.data;
      setUser(userData);
      
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Profile fetch failed (Token might be expired):', error);
      clearAuthData();
      setToken(null);
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      setToken(storedToken);
      fetchUserProfile(storedToken).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    saveAuthData(newToken, userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    clearAuthData();
    router.push('/');
  };

  const isLoggedIn = !!user && !!token;

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading App...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, logout, fetchUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};