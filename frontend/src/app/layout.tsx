// src/app/layout.tsx
import React from "react";
import "@/app/styles/globals.css";
import Header from "@/widgets/main_header/Header";
// import Header from "@/widgets/side_header/Header"; // 주석 처리 유지
import Footer from "@/widgets/footer/Footer";
import ChatWidget from "@/chat/ChatWidget";
import { AuthProvider } from "./providers/AuthContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-white text-gray-800">
        <AuthProvider> 
          <Header />
          <main className="min-h-screen">{children}</main>
          <ChatWidget />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}