import React from "react";
import "@/app/styles/globals.css";
import Footer from "@/widgets/footer/Footer";
import ChatWidget from "@/chatbot/ChatbotWidget";
import type { Metadata } from 'next';

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
        <main className="min-h-screen">{children}</main>
        <ChatWidget />
        <Footer />
      </body>
    </html>
  );
}
