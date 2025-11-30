import React from "react";
import "@/app/styles/globals.css";
import Header from "@/widgets/main_header/Header";
// import Header from "@/widgets/side_header/Header";
import Footer from "@/widgets/footer/Footer";
import ChatWidget from "@/chatbot/ChatbotWidget";
import { Suspense } from "react";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body className="bg-white text-gray-800">
        <Suspense>
          <Header />
        </Suspense>

        <main className="min-h-screen">{children}</main>

        <ChatWidget />
        <Footer />
      </body>
    </html>
  );
}