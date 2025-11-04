import React from "react";
import "@/app/styles/globals.css";
import Header from "@/widgets/header/Header";
import Footer from "@/widgets/footer/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-white text-gray-800">
        <Header />
        <main className="min-h-screen">{children}</main>  
        <Footer />
      </body>
    </html>
  );
}