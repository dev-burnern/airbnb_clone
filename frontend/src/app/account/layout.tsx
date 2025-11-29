// src/app/account/layout.tsx 또는 AccountSettingsLayout.tsx (수정됨)
"use client"; // usePathname을 사용하려면 "use client"가 필요합니다.

import { usePathname } from "next/navigation"; // usePathname 임포트
import { AccountSidebar } from "@/widgets/account-sidebar/AccountSidebar";

export default function AccountSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 사이드바를 숨길 경로를 정의합니다.
  const pathWithoutSidebar = "/account/payments-payouts/history";

  // 현재 경로가 사이드바를 숨길 경로와 일치하는지 확인합니다.
  const hideSidebar = pathname === pathWithoutSidebar;
  
  // 사이드바를 숨길 경로에서는 "계정 관리" 제목도 숨기고 콘텐츠를 전체 너비로 표시합니다.

  return (
    // 사이드바가 있는 페이지에서는 최대 너비를 유지하고, 없는 페이지에서는 유연하게 확장되도록 조정합니다.
    <div className="max-w-7xl mx-auto px-6 py-16">
      
      {/* 사이드바가 숨겨지지 않을 때만 "계정 관리" 제목을 보여줍니다. */}
      {!hideSidebar && (
        <h1 className="text-3xl font-bold mb-12">계정 관리</h1>
      )}
      
      <div className="flex flex-col md:flex-row">
        
        {/* 왼쪽 사이드바 위젯: hideSidebar가 false일 때만 렌더링 */}
        {!hideSidebar && <AccountSidebar />}
        
        {/* 오른쪽 콘텐츠 영역 */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}