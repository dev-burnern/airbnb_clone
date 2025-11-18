"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; 
import HeaderSearchBar from "./HeaderSearchBar";
import HeaderProfile from "./HeaderProfile";
import EmailLogion from "../login_or_signup/EmailLogion";
import PasswordLogin from "../login_or_signup/PasswordLogin";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");

  const router = useRouter(); 

  const handleNavigation = (path: string) => {
    router.push(path);
    setMenuOpen(false);
  };

  const handleLoginOpen = () => {
    setEmailModalOpen(true);
    setMenuOpen(false);
  };

  return (
    <header className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5 relative">
        {/* 좌측 로고 (클릭 시 홈으로 이동) */}
        <div className="flex items-center gap-2">
          <div 
            onClick={() => handleNavigation("/")} 
            className="cursor-pointer"
          >
            <Image
              src="/images/airbnb_logo.png"
              alt="Airbnb Logo"
              width={100}
              height={32}
            />
          </div>
        </div>

        {/* 중앙 검색 */}
        <div className="flex-1 flex justify-center">
          <HeaderSearchBar />
        </div>

        {/* 우측 프로필 + 메뉴 */}
        <div className="flex items-center gap-3">
          <HeaderProfile
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />

          {/* 햄버거 메뉴 버튼 */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex flex-col justify-center items-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            aria-label="메뉴 열기"
          >
            <span className={`block w-5 h-0.5 bg-gray-700 transition-transform duration-200 ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 my-1 transition-opacity duration-200 ${menuOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-transform duration-200 ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
          </button>
        </div>

        {/* 메뉴 드롭다운 */}
        {menuOpen && (
          <div className="absolute top-16 right-6 bg-white border border-gray-200 rounded-xl shadow-lg w-48 py-2 animate-fadeIn z-50 flex flex-col">
            
            <button
              type="button"
              onClick={() => handleNavigation("/")}
              className="text-left px-4 py-2 hover:bg-gray-100 transition-colors w-full"
            >
              홈
            </button>
            
            <button
              type="button"
              onClick={() => handleNavigation("/wishlist")}
              className="text-left px-4 py-2 hover:bg-gray-100 transition-colors w-full"
            >
              위시리스트
            </button>
            
            <button
              type="button"
              onClick={() => handleNavigation("/messages")} // 예약내역 페이지가 없어서 메시지로 임시 연결
              className="text-left px-4 py-2 hover:bg-gray-100 transition-colors w-full"
            >
              예약내역
            </button>
            
            <button
              type="button"
              onClick={() => handleNavigation("/messages")}
              className="text-left px-4 py-2 hover:bg-gray-100 transition-colors w-full"
            >
              메시지
            </button>

            <hr className="my-2 bsorder-gray-200" />
            
            <button
              type="button"
              onClick={() => handleNavigation("/account")}
              className="text-left px-4 py-2 hover:bg-gray-100 transition-colors w-full"
            >
              계정관리
            </button>

            <button
              type="button"
              onClick={() => handleNavigation("/account/language-and-currency")}
              className="text-left px-4 py-2 hover:bg-gray-100 transition-colors w-full"
            >
              언어 및 통화
            </button>

            <hr className="my-2 border-gray-200" />
            
            {/* 로그인 버튼 (모달 오픈) */}
            <button
              type="button"
              onClick={handleLoginOpen}
              className="text-left px-4 py-2 hover:bg-gray-100 transition-colors w-full"
            >
              로그인 및 회원가입
            </button>
          </div>
        )}
      </div>

      {/* 1단계: 이메일 입력 모달 */}
      <EmailLogion
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        onSubmit={(email) => {
          setLoginEmail(email);
          setEmailModalOpen(false);
          setPasswordModalOpen(true);
        }}
      />

      {/* 2단계: 비밀번호 입력 모달 */}
      <PasswordLogin
        open={passwordModalOpen}
        email={loginEmail}
        onClose={() => setPasswordModalOpen(false)}
        onBack={() => {
          setPasswordModalOpen(false);
          setEmailModalOpen(true);
        }}
        onSubmit={(password: string) => {
          console.log("로그인 시도:", { email: loginEmail, password });
          setPasswordModalOpen(false);
          setIsLoggedIn(true);
        }}
      />
    </header>
  );
}