"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; 
import HeaderSearchBar from "./HeaderSearchBar";
import HeaderProfile from "./HeaderProfile";
import EmailLogion from "../login_or_signup/EmailLogion";
import PasswordLogin from "../login_or_signup/PasswordLogin";
import { useAuth } from "../../app/providers/AuthContext";

export default function Header() {
  const { isLoggedIn, logout } = useAuth(); 

  
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
        <div className="flex items-center gap-2">
          <div 
            onClick={() => handleNavigation("/")} 
            className="cursor-pointer"
          >
            {/* 실제 에어비앤비 로고 이미지 경로는 '/images/airbnb_logo.png'로 가정 */}
            <Image
              // src="https://placehold.co/100x32/FF385C/FFFFFF/png?text=airbnb"
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
          {/* HeaderProfile은 Context 상태를 직접 사용합니다. */}
          <HeaderProfile /> 

          {/* 햄버거 메뉴 버튼 */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex flex-col justify-center items-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            aria-label="메뉴 열기"
          >
            {/* 햄버거 메뉴 아이콘 (SVG 대신 Tailwind CSS로 구현) */}
            <span className={`block w-5 h-0.5 bg-gray-700 transition-transform duration-200 ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 my-1 transition-opacity duration-200 ${menuOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-transform duration-200 ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
          </button>
        </div>

        {/* 메뉴 드롭다운 */}
        {menuOpen && (
          <div className="absolute top-16 right-6 bg-white border border-gray-200 rounded-xl shadow-lg w-48 py-2 animate-fadeIn z-50 flex flex-col">
            
            {/* 비로그인 시: 로그인/회원가입 버튼 */}
            {!isLoggedIn ? (
              <button
                type="button"
                onClick={handleLoginOpen}
                className="text-left px-4 py-2 hover:bg-gray-100 transition-colors w-full font-semibold"
              >
                로그인 및 회원가입
              </button>
            ) : (
               <button
                type="button"
                onClick={() => handleNavigation("/")}
                className="text-left px-4 py-2 hover:bg-gray-100 transition-colors w-full"
              >
                홈
              </button>
            )}

            <hr className="my-2 border-gray-200" />
            
            {/* 로그인 상태에 관계없이 표시되는 항목들 (예약내역, 메시지, 위시리스트) */}
            <button
              type="button"
              onClick={() => handleNavigation("/wishlist")}
              className="text-left px-4 py-2 hover:bg-gray-100 transition-colors w-full"
            >
              위시리스트
            </button>
            
            <button
              type="button"
              onClick={() => handleNavigation("/messages")}
              className="text-left px-4 py-2 hover:bg-gray-100 transition-colors w-full"
            >
              메시지
            </button>

            <hr className="my-2 border-gray-200" />
            
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

            {/* 로그인 시에만 표시되는 로그아웃 버튼 */}
            {isLoggedIn && (
              <>
                <hr className="my-2 border-gray-200" />
                <button
                  type="button"
                  onClick={() => {
                    logout(); // Context의 로그아웃 함수 호출
                    setMenuOpen(false);
                  }}
                  className="text-left px-4 py-2 hover:bg-gray-100 transition-colors w-full"
                >
                  로그아웃
                </button>
              </>
            )}
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
          setPasswordModalOpen(true); // 이메일 확인 후 비밀번호 모달로 전환
        }}
      />


      {/* 2단계: 비밀번호 입력 모달 */}
      <PasswordLogin
        open={passwordModalOpen}
        email={loginEmail}
        onClose={() => setPasswordModalOpen(false)}
        onBack={() => {
          setPasswordModalOpen(false);
          setEmailModalOpen(true); // 뒤로가기 시 이메일 모달로 복귀
        }}
        // PasswordLogin 내부에서 로그인 성공 후 모달을 닫도록 처리했기 때문에, 여기서는 상태만 변경합니다.
        onSubmit={() => {
          setPasswordModalOpen(false);
        }}
      />
    </header>
  );
}