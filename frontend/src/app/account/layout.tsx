// src/app/account/layout.tsx 또는 AccountSettingsLayout.tsx
"use client";

import { usePathname } from "next/navigation";
// AccountSidebar는 UserProfileContent 내에서 직접 렌더링되므로 더 이상 필요하지 않습니다.
// import { AccountSidebar } from "@/widgets/account-sidebar/AccountSidebar"; 

export default function AccountSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 사이드바를 숨길 경로를 정의합니다.
  const pathWithoutSidebar = ["/account/payments-payouts/history", "/account/profile"];

  // 현재 경로가 사이드바를 숨길 경로와 일치하는지 확인합니다.
  const hideSidebar = pathWithoutSidebar.includes(pathname ?? "");
  
  // AccountSettingsLayout에서는 '계정 관리' 제목을 사용하고 있지 않으므로 제거하거나,
  // UserProfileContent가 account/profile 경로의 children으로 가정하고 수정합니다.

  return (
    // 고정 문제를 피하기 위해, 이 레이아웃은 최소한의 패딩만 제공하고
    // sticky 기능을 유발하는 flex-row를 제거하여 children(UserProfileContent)이 단독으로 레이아웃을 잡도록 합니다.
    // 하지만 Next.js App Router의 layout.tsx 구조를 유지하기 위해 flex 구조는 유지합니다.
    <div className="max-w-7xl mx-auto px-6 py-16">
      
      {/* 이 경로가 /account/profile 이라면 UserProfileContent 내부에서 '프로필' 제목을 표시하므로 여기서는 제목을 제거합니다. */}
      {/* {!hideSidebar && (
        <h1 className="text-3xl font-bold mb-12">계정 관리</h1>
      )} */}
      
      {/* UserProfileContent가 /account/profile의 내용을 모두 담고 있으므로
        여기서는 추가적인 flex-row 분할 없이 children을 전체 너비로 렌더링합니다. 
      */}
      <main className="min-w-0">
        {children}
      </main>
    </div>
  );
}