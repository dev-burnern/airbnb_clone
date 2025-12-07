"use client";

import { useRouter, usePathname } from "next/navigation";

export default function HostHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleSwitchToGuestMode = () => {
    router.push("/");
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
              className={`text-sm font-medium transition ${
                pathname === '/host' 
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              투데이
            </button>
            <button
              onClick={() => handleNavigation('/host/calendar')}
              className={`text-sm font-medium transition ${
                pathname === '/host/calendar' 
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              달력
            </button>
            <button
              onClick={() => handleNavigation('/host/listings')}
              className={`text-sm font-medium transition ${
                pathname?.startsWith('/host/listings') 
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              리스팅
            </button>
            <button
              onClick={() => handleNavigation('/host/messages')}
              className={`text-sm font-medium transition ${
                pathname === '/host/messages' 
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              메시지
            </button>
          </nav>

          {/* 우측 버튼 */}
          <div className="w-32 flex justify-end">
            <button
              onClick={handleSwitchToGuestMode}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition whitespace-nowrap"
            >
              게스트 모드로 전환
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
