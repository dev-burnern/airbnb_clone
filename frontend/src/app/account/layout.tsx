"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import SideHeader from "@/widgets/side_header/Header";

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

  const pathWithoutSidebar = ["/account/payments-payouts/history", "/account/profile", "/account/profile/edit"];
  const hideSidebar = pathWithoutSidebar.includes(pathname ?? "");
  
  return (
    <>
      <SideHeader /> 
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {!hideSidebar && (
            <aside className="w-full md:w-64 shrink-0">
              <AccountSidebar />
            </aside>
          )}
          
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
