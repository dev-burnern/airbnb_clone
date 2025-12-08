"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Globe, Shield, Bell, CreditCard, Lock } from "lucide-react";
import { useTranslations } from 'next-intl';

export const AccountSidebar = () => {
  const pathname = usePathname();
  const t = useTranslations('accountSidebar');

  const SIDEBAR_ITEMS = [
    { name: t('personalInfo'), href: "/account/personal-info", icon: User },
    { name: t('languageCurrency'), href: "/account/language-and-currency", icon: Globe },
    { name: t('loginSecurity'), href: "/account/login-and-security", icon: Shield },
    { name: t('privacy'), href: "/account/privacy-and-sharing", icon: Lock },
    { name: t('notifications'), href: "/account/notifications", icon: Bell },
    { name: t('paymentsPayouts'), href: "/account/payments-payouts", icon: CreditCard },
  ];

  return (
    <aside className="shrink-0 mb-8 md:mb-0 pr-8">
      <nav className="flex flex-col space-y-1">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${isActive
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