// Header.tsx (수정됨)
"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import HeaderSearchBar from "./HeaderSearchBar";
import HeaderProfile from "./HeaderProfile";
import EmailLogion from "../login_or_signup/EmailLogion";
import PasswordLogin from "../login_or_signup/PasswordLogin";
import SignupModal from "@/widgets/login_or_signup/SignupModal";
import AuthTokenHandler from "./AuthTokenHandler";
import HostRegistrationModal from "@/components/host/HostRegistrationModal";
// Lucide-React 아이콘 임포트
import {
  Heart, // 위시리스트
  MessageSquare, // 메시지
  User, // 프로필
  Settings, // 계정 관리
  Globe, // 언어 및 통화
  LogOut, // 로그아웃
  LogIn, // 로그인
  Home, // 홈
  Menu, // 햄버거 메뉴를 아이콘으로 대체할 경우
} from "lucide-react";

// 드롭다운 메뉴 항목 데이터 구조화 (재사용성 및 명확성 확보)
interface MenuItem {
  name: string;
  path: string;
  icon: React.ElementType; // Lucide icon component type
  isLoggedInRequired: boolean | null; // true: 로그인 시 표시, false: 로그아웃 시 표시, null: 항상 표시
  onClick?: (path: string) => void;
}

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [hasListing, setHasListing] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // 현재 호스트 모드인지 확인
  const isHostMode = pathname?.startsWith('/host') ?? false;

  // 페이지 로드 시 저장된 토큰 유효성 검증
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      try {
        // 토큰 유효성 검증을 위한 API 호출
        const response = await fetch('http://localhost:3001/api/v1/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsLoggedIn(true);

          // 사용자의 리스팅 보유 여부 확인
          try {
            const listingsResponse = await fetch('http://localhost:3001/api/v1/listings/my', {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            if (listingsResponse.ok) {
              const listingsData = await listingsResponse.json();
              const listings = Array.isArray(listingsData) ? listingsData : (listingsData.data || []);
              if (listings.length > 0) {
                setHasListing(true);
                localStorage.setItem('hasListing', 'true');
              } else {
                setHasListing(false);
                localStorage.removeItem('hasListing');
              }
            }
          } catch (listingError) {
            console.warn('리스팅 확인 실패:', listingError);
          }
        } else {
          // 토큰이 만료되었거나 유효하지 않음
          localStorage.removeItem('accessToken');
          setIsLoggedIn(false);
        }
      } catch (error) {
        // 네트워크 오류 등 - 토큰은 유지하고 오프라인 상태로 간주
        console.warn('토큰 검증 실패:', error);
        setIsLoggedIn(false);
      }
    };

    validateToken();
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
    setMenuOpen(false);
  };



  // 로그아웃 처리 함수
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    setMenuOpen(false);
  };

  const handleLoginOpen = () => {
    setEmailModalOpen(true);
    setMenuOpen(false);
  };

  // --- 메뉴 항목 정의 ---
  const menuItems: MenuItem[] = [
    { name: "홈", path: "/", icon: Home, isLoggedInRequired: null },
    { name: "위시리스트", path: "/wishlist", icon: Heart, isLoggedInRequired: true },
    { name: "메시지", path: "/messages", icon: MessageSquare, isLoggedInRequired: true },
    { name: "프로필", path: "/account/profile", icon: User, isLoggedInRequired: true },
    { name: "계정 관리", path: "/account", icon: Settings, isLoggedInRequired: true },
    { name: "언어 및 통화", path: "/account/language-and-currency", icon: Globe, isLoggedInRequired: true },
  ];
  // ----------------------

  return (
    <header className="bg-white border-b border-gray-200"> {/* 배경을 흰색으로 변경 */}
      <Suspense fallback={null}>
        <AuthTokenHandler setIsLoggedIn={setIsLoggedIn} />
      </Suspense>
      <div className="w-full pl-6 pr-2 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">

          {/* 좌측 로고 (클릭 시 홈으로 이동) */}
          <div className="flex items-center gap-2" style={{ minWidth: '150px' }}>
            <div
              onClick={() => handleNavigation("/")}
              className="cursor-pointer"
            >
              {/* 제공된 이미지 로고로 대체 (Next.js 모듈 에러 방지를 위해 <img> 태그 사용) */}
              <img
                src="/images/airbnb_logo.png" // 업로드된 이미지 경로를 명시
                alt="Airbnb Logo"
                className="block h-8 w-auto" // Tailwind CSS를 사용하여 <img> 태그 스타일링
              />
            </div>
          </div>

          {/* 중앙 - 호스트 모드일 때는 네비게이션, 게스트 모드일 때는 검색 */}
          {isHostMode ? (
            <nav className="flex-1 flex justify-center">
              <div className="flex items-center gap-8">
                <button
                  onClick={() => handleNavigation("/host")}
                  className="text-sm font-semibold hover:underline transition"
                >
                  투데이
                </button>
                <button
                  onClick={() => handleNavigation("/host/calendar")}
                  className="text-sm font-semibold hover:underline transition"
                >
                  달력
                </button>
                <button
                  onClick={() => handleNavigation("/host/listings")}
                  className="text-sm font-semibold hover:underline transition"
                >
                  리스팅
                </button>
                <button
                  onClick={() => handleNavigation("/host/messages")}
                  className="text-sm font-semibold hover:underline transition"
                >
                  메시지
                </button>
              </div>
            </nav>
          ) : (
            <div className="flex-1 flex justify-center px-4 ml-45">
              <div className="max-w-3xl w-full">
                <HeaderSearchBar />
              </div>
            </div>
          )}

          {/* 우측 프로필 + 메뉴 */}
          <div className="flex items-center gap-3">
            {/* 호스트 되기 / 호스트 모드로 전환 / 게스트 모드로 전환 버튼 */}
            {isHostMode ? (
              <button
                onClick={() => handleNavigation("/")}
                className="text-sm font-semibold hover:bg-gray-100 px-4 py-2 rounded-full transition whitespace-nowrap"
              >
                게스트 모드로 전환
              </button>
            ) : hasListing ? (
              <button
                onClick={() => handleNavigation("/host")}
                className="text-sm font-semibold hover:bg-gray-100 px-4 py-2 rounded-full transition whitespace-nowrap"
              >
                호스트 모드로 전환
              </button>
            ) : (
              <button
                onClick={() => setHostModalOpen(true)}
                className="text-sm font-semibold hover:bg-gray-100 px-4 py-2 rounded-full transition whitespace-nowrap"
              >
                호스팅하기
              </button>
            )}

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
                  {menuItems.filter(item => item.isLoggedInRequired !== false).map((item, index) => (
                    <div key={item.name}>
                      {/* 로그인 상태 필터링: isLoggedInRequired가 true이고 로그인 안된 경우, 또는 path가 없는 경우 건너뛰기 */}
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
                      {/* 프로필, 메시지 다음 구분선 추가 (UI 이미지 기반) */}
                      {((isLoggedIn && item.name === '프로필') || (!isLoggedIn && item.name === '홈')) && <hr className="my-2 border-gray-200" />}
                    </div>
                  ))}

                  {/* 로그인/로그아웃 및 기타 메뉴 */}
                  <div className="mt-1">
                    {/* 로그인 상태에 따른 메뉴 표시 */}
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
                      <>
                        {/* 언어 및 통화는 이미 위에서 처리되었거나, 필요하다면 여기에 다시 분류 */}
                        {/* <hr className="my-2 border-gray-200" /> */}
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex items-center gap-3 text-left px-4 py-3 hover:bg-gray-100 transition-colors w-full font-normal text-gray-700"
                        >
                          <LogOut size={18} className="text-gray-600" />
                          로그아웃
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 모달들은 이전과 동일하게 유지 */}
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

      {/* 호스트 등록 모달 */}
      <HostRegistrationModal
        isOpen={hostModalOpen}
        onClose={() => setHostModalOpen(false)}
      />
    </header>
  );
}