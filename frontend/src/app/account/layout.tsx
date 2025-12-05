// src/app/account/layout.tsx 또는 AccountSettingsLayout.tsx

"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const AccountSidebar = dynamic(
  () => import("@/widgets/account-sidebar/AccountSidebar").then((mod) => mod.AccountSidebar),
  { ssr: false }
);

export default function AccountSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const pathWithoutSidebar = ["/account/payments-payouts/history", "/account/profile"];
  const hideSidebar = pathWithoutSidebar.includes(pathname ?? "");
  
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row gap-8">
        
        {!hideSidebar && (
          <aside className="w-full md:w-[300px] shrink-0 pr-8">
            <AccountSidebar />
          </aside>
        )}
        
        <main className={`min-w-0 ${!hideSidebar ? 'flex-1' : 'w-full'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}