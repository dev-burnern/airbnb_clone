// src/widgets/side_header/Header.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import HeaderProfile from "../main_header/HeaderProfile";
import EmailLogion from "../login_or_signup/EmailLogion";
import PasswordLogin from "../login_or_signup/PasswordLogin";
import SignupModal from "@/widgets/login_or_signup/SignupModal";
import AuthTokenHandler from "../main_header/AuthTokenHandler";
import {
  Heart, 
  MessageSquare, 
  User, 
  Settings, 
  Globe, 
  LogOut, 
  LogIn, 
  Home, 
  Menu, 
} from "lucide-react";

interface MenuItem {
  name: string;
  path: string;
  icon: React.ElementType;
  isLoggedInRequired: boolean | null;
  onClick?: (path: string) => void;
}

export default function Header() { 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    setMenuOpen(false);
  };

  const handleLoginOpen = () => {
    setEmailModalOpen(true);
    setMenuOpen(false);
  };

  const menuItems: MenuItem[] = [
    { name: "홈", path: "/", icon: Home, isLoggedInRequired: null },
    { name: "위시리스트", path: "/wishlist", icon: Heart, isLoggedInRequired: true },
    { name: "메시지", path: "/messages", icon: MessageSquare, isLoggedInRequired: true },
    { name: "프로필", path: "/account/profile", icon: User, isLoggedInRequired: true },
    { name: "계정 관리", path: "/account", icon: Settings, isLoggedInRequired: true },
    { name: "언어 및 통화", path: "/account/language-and-currency", icon: Globe, isLoggedInRequired: true },
  ];

  return (
    <header className="bg-white border-b border-gray-200 relative">
      <Suspense fallback={null}>
        <AuthTokenHandler setIsLoggedIn={setIsLoggedIn} />
      </Suspense>
      <div className="w-full pl-6 pr-2 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">

        {/* 좌측 로고 */}
        <div className="flex items-center gap-2" style={{ minWidth: '150px' }}>
          <div
            onClick={() => handleNavigation("/")}
            className="cursor-pointer"
          >
            <img
              src="/images/airbnb_logo.png" 
              alt="Airbnb Logo"
              className="block h-8 w-auto" 
            />
          </div>
        </div>

        {/* 중앙 영역 비움 (검색바 제거) */}
        <div className="flex-1"></div>

        {/* 우측 프로필 + 메뉴 */}
        <div className="flex items-center gap-3 flex-shrink-0 justify-end ml-auto">
          <HeaderProfile
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />

          {/* 햄버거 메뉴 버튼 */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex flex-col justify-center items-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              aria-label="메뉴 열기"
            >
              <span className={`block w-5 h-0.5 bg-gray-700 transition-transform duration-200 ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`block w-5 h-0.5 bg-gray-700 my-1 transition-opacity duration-200 ${menuOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`block w-5 h-0.5 bg-gray-700 transition-transform duration-200 ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </button>

            {/* 메뉴 드롭다운 */}
            {menuOpen && (
              <div className="absolute top-12 right-0 bg-white border border-gray-100 rounded-xl shadow-2xl w-56 py-3 animate-fadeIn z-50 flex flex-col">
                {/* 메인 메뉴 섹션 */}
                {menuItems.filter(item => item.isLoggedInRequired !== false).map((item) => (
                  <div key={item.name}>
                    {!(item.isLoggedInRequired === true && !isLoggedIn) && (
                      <button
                        type="button"
                        onClick={() => handleNavigation(item.path)}
                        className={`flex items-center gap-3 text-left px-4 py-3 hover:bg-gray-100 transition-colors w-full ${item.name === '프로필' || item.name === '위시리스트' ? 'font-semibold' : 'font-normal text-gray-700'}`}
                      >
                        <item.icon size={18} className="text-gray-600" />
                        {item.name}
                      </button>
                    )}
                    {((isLoggedIn && item.name === '프로필') || (!isLoggedIn && item.name === '홈')) && <hr className="my-2 border-gray-200" />}
                  </div>
                ))}

                {/* 로그인/로그아웃 */}
                <div className="mt-1">
                  {!isLoggedIn ? (
                    <button
                      type="button"
                      onClick={handleLoginOpen}
                      className="flex items-center gap-3 text-left px-4 py-3 hover:bg-gray-100 transition-colors w-full font-normal text-gray-700"
                    >
                      <LogIn size={18} className="text-gray-600" />
                      로그인 및 회원가입
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-3 text-left px-4 py-3 hover:bg-gray-100 transition-colors w-full font-normal text-gray-700"
                    >
                      <LogOut size={18} className="text-gray-600" />
                      로그아웃
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 모달들 */}
      <EmailLogion
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        onSubmit={(email) => {
          setLoginEmail(email);
          setEmailModalOpen(false);
          setPasswordModalOpen(true);
        }}
        onSignup={(email) => {
          setLoginEmail(email);
          setEmailModalOpen(false);
          setSignupModalOpen(true);
        }}
      />

      <PasswordLogin
        open={passwordModalOpen}
        email={loginEmail}
        onClose={() => setPasswordModalOpen(false)}
        onBack={() => {
          setPasswordModalOpen(false);
          setEmailModalOpen(true);
        }}
        onSubmit={() => {
          setPasswordModalOpen(false);
          setIsLoggedIn(true);
        }}
      />

      <SignupModal
        open={signupModalOpen}
        email={loginEmail}
        onClose={() => setSignupModalOpen(false)}
        onBack={() => {
          setSignupModalOpen(false);
          setEmailModalOpen(true);
        }}
        onSubmit={() => {
          setSignupModalOpen(false);
          setIsLoggedIn(true);
        }}
      />
      </div>
    </header>
  );
}
