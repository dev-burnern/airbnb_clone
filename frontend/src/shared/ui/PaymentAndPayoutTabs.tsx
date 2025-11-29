// src/shared/ui/PaymentAndPayoutTabs.tsx

interface PaymentAndPayoutTabsProps {
  activeTab: 'payment' | 'payout' | 'serviceFee';
  onTabChange: (tab: 'payment' | 'payout' | 'serviceFee') => void;
}

export const PaymentAndPayoutTabs = ({ activeTab, onTabChange }: PaymentAndPayoutTabsProps) => {
  const tabs = [
    { key: 'payment', label: '결제' },
  ] as const;

  const tabClass = (tabName: 'payment' | 'payout' | 'serviceFee') => 
    `px-4 py-2 text-sm font-medium transition-colors ${
      activeTab === tabName 
        ? 'text-gray-900 border-b-2 border-gray-900' 
        : 'text-gray-500 hover:text-gray-700'
    }`;

  return (
    <div className="flex border-b border-gray-200 mb-6">
      {tabs.map(tab => (
        <button 
          key={tab.key}
          className={tabClass(tab.key)}
          onClick={() => onTabChange(tab.key)}
          // 요청에 따라 '대금 수령'과 '서비스 수수료'는 비활성화된 것처럼 표시
          disabled={tab.key !== 'payment'}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};