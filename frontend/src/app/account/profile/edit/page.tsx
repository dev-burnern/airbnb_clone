'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { EditProfileSection } from '@/widgets/user-profile/EditProfileSection';

// --- 프로필 수정 페이지 (라우팅 컴포넌트) ---
// 경로: /account/profile/edit
export default function EditAccountProfilePage() {
  const router = useRouter();

  // "완료" 버튼 클릭 시 프로필 페이지로 이동하는 핸들러
  const handleComplete = () => {
    // 실제로는 여기서 프로필 저장 API 호출 로직이 들어갑니다.
    console.log('프로필 정보 저장 완료');
    router.push('/account/profile'); // 프로필 페이지로 이동
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 이 헤더 부분을 제거하여 "프로필" 제목 중복을 피하고, 
          EditProfileSection이 페이지 상단에 바로 오도록 합니다. */}
      {/* <header className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">프로필</h1>
        </div>
      </header> */}

      {/* EditProfileSection이 페이지의 메인 콘텐츠로 바로 시작합니다. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EditProfileSection onComplete={handleComplete} />
      </div>
    </div>
  );
}