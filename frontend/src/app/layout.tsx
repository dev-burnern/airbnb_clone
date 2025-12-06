// src/app/layout.tsx (수정 완료)

import React from "react";
import "@/app/styles/globals.css";
// Header는 각 페이지 그룹 레이아웃에서 적용되므로 전역 레이아웃에서 제거합니다.
// import Header from "@/widgets/main_header/Header"; 
import Footer from "@/widgets/footer/Footer";
import ChatWidget from "@/chatbot/ChatbotWidget";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="bg-white text-gray-800" suppressHydrationWarning>
        {/* <Header /> */}
        <main className="min-h-screen">{children}</main>
        <ChatWidget />
        <Footer />
      </body>
    </html>
  );
}