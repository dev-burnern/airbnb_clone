"use client";

// src/shared/ui/LoginAndSecurityTabs.tsx

interface LoginAndSecurityTabsProps {
  activeTab: 'login' | 'access';
  onTabChange: (tab: 'login' | 'access') => void;
}

export const LoginAndSecurityTabs = ({ activeTab, onTabChange }: LoginAndSecurityTabsProps) => {
  const tabClass = (tabName: 'login' | 'access', label: string) => 
    `px-4 py-2 text-sm font-medium transition-colors ${
      activeTab === tabName 
        ? 'text-gray-900 border-b-2 border-gray-900' 
        : 'text-gray-500 hover:text-gray-700'
    }`;

  return (
    <div className="flex border-b border-gray-200 mb-6">
      <button 
        className={tabClass('login', '로그인')}
        onClick={() => onTabChange('login')}
      >
        로그인
      </button>
      <button 
        className={tabClass('access', '접근 권한 공유')}
        onClick={() => onTabChange('access')}
      >
        접근 권한 공유
      </button>
    </div>
  );
};