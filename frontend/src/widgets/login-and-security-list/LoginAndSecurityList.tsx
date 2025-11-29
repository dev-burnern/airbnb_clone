// src/widgets/login-and-security-list/LoginAndSecurityList.tsx

"use client";

import { useState } from "react";
import { LoginAndSecurityTabs } from "@/shared/ui/LoginAndSecurityTabs";
import { LoginSection } from "@/features/login-and-security/LoginSection";
import { AccessAndSharing } from "@/features/login-and-security/AccessAndSharing";

export const LoginAndSecurityList = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'access'>('login');

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">로그인 및 보안</h1>
      </div>

      <LoginAndSecurityTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'login' && <LoginSection />}
      {activeTab === 'access' && <AccessAndSharing />}
    </div>
  );
};