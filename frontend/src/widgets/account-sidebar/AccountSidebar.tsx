"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Globe, Shield, Bell, CreditCard, Briefcase } from "lucide-react";

const SIDEBAR_ITEMS = [
  { name: "개인 정보", href: "/account/personal-info", icon: User },
  { name: "언어 및 통화", href: "/account/language-and-currency", icon: Globe },
  { name: "로그인 및 보안", href: "#", icon: Shield },
  { name: "알림", href: "#", icon: Bell },
];

export const AccountSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-[300px] shrink-0 mb-8 md:mb-0 pr-8">
      <nav className="flex flex-col space-y-1">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};