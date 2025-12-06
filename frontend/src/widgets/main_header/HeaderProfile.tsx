import { useState } from "react";
import { useRouter } from "next/navigation";

type SetLoginState = (next: boolean | ((prev: boolean) => boolean)) => void;
interface HeaderProfileProps {
  isLoggedIn: boolean;
  setIsLoggedIn: SetLoginState;
}

export default function HeaderProfile({ isLoggedIn, setIsLoggedIn }: HeaderProfileProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleProfileClick = () => {
    if (isLoggedIn) {
      // 로그인 상태에서는 프로필 페이지로 이동
      router.push("/account/profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    setIsMenuOpen(false);
  };

  return (
    <div className="flex items-center space-x-4">
      <button className="text-sm font-medium hover:bg-gray-100 px-3 py-2 rounded-full">호스팅하기</button>

      {isLoggedIn ? (
        <button
          onClick={handleProfileClick}
          className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold hover:bg-gray-300 transition cursor-pointer"
          title="프로필 보기"
        >
          👤
        </button>
      ) : (
        <button className="text-xl">🌍</button>
      )}
    </div>
  )
}
