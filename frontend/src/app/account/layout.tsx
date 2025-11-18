import { AccountSidebar } from "@/widgets/account-sidebar/AccountSidebar";

export default function AccountSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-12">계정 관리</h1>
      
      <div className="flex flex-col md:flex-row">
        {/* 왼쪽 사이드바 위젯 */}
        <AccountSidebar />
        
        {/* 오른쪽 콘텐츠 영역 */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}