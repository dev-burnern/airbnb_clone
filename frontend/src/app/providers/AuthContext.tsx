"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

// Local Storage 키
const TOKEN_KEY = 'accessToken';
const USER_KEY = 'userProfile';
const API_BASE_URL = 'http://localhost:8080';

// 헬퍼 함수
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
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const userData: User = await response.json();
        setUser(userData);
        return userData; 
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Profile fetch failed:', error);
      clearAuthData();
      setToken(null);
      setUser(null);
      return null; 
    }
  };

  // 초기 로딩: Local Storage에서 인증 정보 로드 및 유효성 검사
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
    // 앱 로딩 중 스피너 등을 표시합니다.
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