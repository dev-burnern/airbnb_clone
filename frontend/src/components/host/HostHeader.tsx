"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { User } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  profileImage?: string;
}

export default function HostHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const response = await fetch('http://localhost:3001/api/v1/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          const data = result.data || result;
          setUser({
            name: data.name || '',
            email: data.email || '',
            profileImage: data.profileImage || data.profile?.profileImage,
          });
        }
      } catch (error) {
        console.error('프로필 가져오기 실패:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
    setMenuOpen(false);
  };

  const handleSwitchToGuestMode = () => {
    router.push("/");
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('hasListing');
    router.push('/');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 좌측 로고 */}
          <div className="w-32">
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

          {/* 중앙 네비게이션 */}
          <nav className="flex items-center gap-8">
            <button
              onClick={() => handleNavigation('/host')}
              className={`text-sm font-medium transition ${pathname === '/host'
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              투데이
            </button>
            <button
              onClick={() => handleNavigation('/host/calendar')}
              className={`text-sm font-medium transition ${pathname === '/host/calendar'
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              달력
            </button>
            <button
              onClick={() => handleNavigation('/host/listings')}
              className={`text-sm font-medium transition ${pathname?.startsWith('/host/listings')
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              리스팅
            </button>
            <button
              onClick={() => handleNavigation('/host/messages')}
              className={`text-sm font-medium transition ${pathname === '/host/messages'
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              메시지
            </button>
          </nav>

          {/* 우측: 게스트 모드 + 프로필 */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSwitchToGuestMode}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition whitespace-nowrap"
            >
              게스트 모드로 전환
            </button>

            {/* 프로필 드롭다운 */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 p-1 rounded-full border border-gray-300 hover:shadow-md transition"
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="프로필"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </button>

              {/* 드롭다운 메뉴 */}
              {menuOpen && (
                <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-xl shadow-lg w-64 py-2 z-50">
                  {/* 사용자 정보 */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="font-semibold text-gray-900">{user?.name || '호스트'}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>

                  {/* 메뉴 항목 */}
                  <button
                    onClick={() => handleNavigation('/account/profile')}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 transition"
                  >
                    프로필 보기
                  </button>
                  <button
                    onClick={() => handleNavigation('/account')}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 transition"
                  >
                    계정 관리
                  </button>

                  <hr className="my-2 border-gray-200" />

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-gray-100 transition"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
