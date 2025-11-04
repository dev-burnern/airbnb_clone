"use client";
import { useState } from "react";
import Image from "next/image";
import HeaderSearchBar from "./HeaderSearchBar";
import HeaderProfile from "../main_header/HeaderProfile";


export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        {/* 좌측 로고 */}
        <div className="flex items-center gap-2">
          <Image src="/images/airbnb_logo.png" alt="Airbnb Logo" width={100} height={32} />
        </div>

        {/* 중앙 검색 */}
        <div className="flex-1 flex justify-center">
          <HeaderSearchBar />
        </div>

        {/* 우측 프로필 */}
        <div className="mr-12">
          <HeaderProfile
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />
        </div>
      </div>
    </header>
  );
}
