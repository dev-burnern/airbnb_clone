// src/widgets/payments-payouts-list/PaymentsAndPayoutsList.tsx

"use client";

import { useState } from "react";
import { PaymentAndPayoutTabs } from "@/shared/ui/PaymentAndPayoutTabs";
import { PaymentSection } from "@/features/payments-payouts/PaymentSection";

// 요청에 따라 현재는 'payment' 탭만 구현되어 있으므로, 다른 탭은 빈 상태를 유지합니다.
const PayoutSection = () => <div className="p-8 text-gray-500">대금 수령 탭 내용</div>;
const ServiceFeeSection = () => <div className="p-8 text-gray-500">서비스 수수료 탭 내용</div>;

export const PaymentsAndPayoutsList = () => {
  const [activeTab, setActiveTab] = useState<'payment' | 'payout' | 'serviceFee'>('payment');

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">결제 및 대금 수령</h1>
      </div>

      <PaymentAndPayoutTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'payment' && <PaymentSection />}
      {activeTab === 'payout' && <PayoutSection />}
      {activeTab === 'serviceFee' && <ServiceFeeSection />}
    </div>
  );
};