import React from "react";
import "@/app/styles/globals.css";
import Footer from "@/widgets/footer/Footer";
import ChatWidget from "@/chatbot/ChatbotWidget";
import type { Metadata } from 'next';
import { I18nProvider } from "@/providers/I18nProvider";

export const metadata: Metadata = {
  title: 'Airbnb Clone',
  description: 'Airbnb 클론 프로젝트',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="bg-white text-gray-800" suppressHydrationWarning>
        <I18nProvider>
          <main className="min-h-screen">{children}</main>
          <ChatWidget />
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
