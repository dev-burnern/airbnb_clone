// src/shared/ui/NotificationTabs.tsx

interface NotificationTabsProps {
  activeTab: 'benefits' | 'account';
  onTabChange: (tab: 'benefits' | 'account') => void;
}

export const NotificationTabs = ({ activeTab, onTabChange }: NotificationTabsProps) => {
  const tabClass = (tabName: 'benefits' | 'account') => 
    `px-4 py-2 text-sm font-medium transition-colors ${
      activeTab === tabName 
        ? 'text-gray-900 border-b-2 border-gray-900' 
        : 'text-gray-500 hover:text-gray-700'
    }`;

  return (
    <div className="flex border-b border-gray-200 mb-6">
      <button 
        className={tabClass('benefits')}
        onClick={() => onTabChange('benefits')}
      >
        혜택 및 업데이트
      </button>
      <button 
        className={tabClass('account')}
        onClick={() => onTabChange('account')}
      >
        계정
      </button>
    </div>
  );
};