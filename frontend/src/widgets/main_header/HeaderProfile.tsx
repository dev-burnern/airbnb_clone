import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type SetLoginState = (next: boolean | ((prev: boolean) => boolean)) => void;
interface HeaderProfileProps {
  isLoggedIn: boolean;
  setIsLoggedIn: SetLoginState;
}

interface UserProfile {
  avatarUrl?: string;
  name?: string;
}

export default function HeaderProfile({ isLoggedIn, setIsLoggedIn }: HeaderProfileProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      // 사용자 프로필 정보 가져오기
      const fetchUserProfile = async () => {
        try {
          const token = localStorage.getItem('accessToken');
          if (!token) {
            setIsLoggedIn(false);
            return;
          }

          const response = await fetch('/backend/api/v1/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const result = await response.json();
            // API 응답이 { success: true, data: {...} } 형식이면 data 추출
            const userData = result.data || result;
            setUserProfile(userData);
          } else if (response.status === 401) {
            // 토큰이 만료되었거나 유효하지 않음 - 로그아웃 처리
            localStorage.removeItem('accessToken');
            setIsLoggedIn(false);
            setUserProfile(null);
          }
        } catch (error) {
          console.error('프로필 정보 가져오기 실패:', error);
        }
      };

      fetchUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [isLoggedIn, setIsLoggedIn]);

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
      {isLoggedIn ? (
        <button
          onClick={handleProfileClick}
          className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden hover:opacity-80 transition cursor-pointer border-2 border-gray-300"
          title="프로필 보기"
        >
          {userProfile?.avatarUrl ? (
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name || "프로필"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="bg-black text-white w-full h-full flex items-center justify-center text-sm font-bold">
              {userProfile?.name?.charAt(0).toUpperCase() || '👤'}
            </div>
          )}
        </button>
      ) : (
        <button className="text-xl">🌍</button>
      )}
    </div>
  )
}
