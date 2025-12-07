'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { EditProfileSection } from '@/widgets/user-profile/EditProfileSection';
import { useProfile, updateUserProfile } from '@/hooks/useProfile';

// --- 프로필 수정 페이지 (라우팅 컴포넌트) ---
// 경로: /account/profile/edit
export default function EditAccountProfilePage() {
  const router = useRouter();
  const { profile, loading, error } = useProfile(null);

  // "완료" 버튼 클릭 시 프로필 페이지로 이동하는 핸들러
  const handleComplete = async (data: any) => {
    try {
      await updateUserProfile(data);
      console.log('프로필 정보 저장 완료');
      // 강제 새로고침을 통해 최신 데이터를 받아오게 함 (Next.js Router Cache 이슈 방지)
      window.location.href = '/account/profile';
    } catch (err) {
      console.error('프로필 업데이트 실패:', err);
      alert('프로필을 저장하는 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-red-600 text-center mx-auto max-w-lg mt-10">오류: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* EditProfileSection이 페이지의 메인 콘텐츠로 바로 시작합니다. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EditProfileSection initialData={profile} onComplete={handleComplete} />
      </div>
    </div>
  );
}