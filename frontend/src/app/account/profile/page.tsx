'use client'; 

import React from 'react';
import { useProfile } from '../../../hooks/useProfile';
// 위젯 컴포넌트 경로를 상대 경로로 수정: app/account/profile에서 widgets/user-profile로 가려면 3단계 위로 올라가야 합니다.
import { UserProfileContent } from '../../../widgets/user-profile/UserProfileContent';

// --- 프로필 페이지 (라우팅 컴포넌트) ---
// 경로: /account/profile
export default function AccountProfilePage() {
  // 실제로는 URL에서 userId를 가져와야 하지만, 현재는 임시 ID를 사용합니다.
  const tempUserId = 'current_user_id'; 
  const { profile, loading, error } = useProfile(tempUserId);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
        <p className="ml-3 text-lg text-gray-600">프로필 데이터를 로드 중...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-red-600 text-center mx-auto max-w-lg mt-10">오류: {error}</div>;
  }
  
  // profile이 null인 경우 (예: 존재하지 않는 사용자 ID)
  if (!profile) {
    return <div className="p-8 text-gray-600 text-center mx-auto max-w-lg mt-10">사용자 프로필을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="bg-white">
      {/* 콘텐츠 표시 - 위젯 사용 */}
      <UserProfileContent profile={profile} />
    </div>
  );
}