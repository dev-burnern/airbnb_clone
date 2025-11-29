// src/widgets/notification-list/NotificationList.tsx

"use client";

import { useState } from "react";
import { NotificationTabs } from "@/shared/ui/NotificationTabs";
import { BenefitsAndUpdate } from "@/features/notifications/BenefitsAndUpdate";
import { AccountNotifications } from "@/features/notifications/AccountNotifications";

export const NotificationList = () => {
  const [activeTab, setActiveTab] = useState<'benefits' | 'account'>('benefits');

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">알림</h1>
      </div>

      <NotificationTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'benefits' && <BenefitsAndUpdate />}
      {activeTab === 'account' && <AccountNotifications />}
    </div>
  );
};