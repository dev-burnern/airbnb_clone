'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase, Utensils, Heart, BookOpen, Clock, Globe, Trello, Calendar, GraduationCap, Lightbulb, Music, PenTool, MessageSquare, PawPrint, Camera, X
} from 'lucide-react';
import { ProfileData } from '../../hooks/useProfile';

// --- 타입 정의 ---
interface EditProfileSectionProps {
  initialData?: ProfileData | null;
  onComplete: (data: any) => void;
}

// --- 공통 컴포넌트: 입력 필드 카드 ---
interface EditItemCardProps {
  icon: React.ElementType;
  title: string;
  placeholder: string;
  value?: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
}

const EditItemCard: React.FC<EditItemCardProps> = ({ icon: Icon, title, placeholder, value, onChange, disabled }) => (
  <div className="flex flex-col p-4 border-b border-gray-200 bg-white">
    <div className="flex items-center space-x-2 mb-2">
      <Icon className="w-4 h-4 text-gray-700" />
      <p className="text-sm font-semibold text-gray-700">{title}</p>
    </div>
    <input
      type="text"
      placeholder={placeholder}
      value={value || ''}
      onChange={(e) => onChange && onChange(e.target.value)}
      disabled={disabled}
      className="w-full text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 border-none p-0 disabled:bg-white disabled:text-gray-400"
    />
  </div>
);

// --- 모달 컴포넌트 정의 ---
interface IntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (intro: string) => void;
  initialValue: string;
}

const IntroModal: React.FC<IntroModalProps> = ({ isOpen, onClose, onSave, initialValue }) => {
  const [introduction, setIntroduction] = useState(initialValue);
  const MAX_CHARS = 500;

  useEffect(() => {
    setIntroduction(initialValue);
  }, [initialValue, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(introduction);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-200 relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-800" />
          </button>
          <h2 className="text-xl font-bold text-center">자기소개</h2>
        </div>

        <div className="p-8 space-y-6">
          <h3 className="text-xl font-semibold">호스트 소개</h3>
          <p className="text-gray-600">
            호스트 또는 게스트가 회원님에 대해 알 수 있도록 간략하게 자기소개를 해주세요.
          </p>
          <textarea
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value.slice(0, MAX_CHARS))}
            className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-0 focus:border-black resize-none"
            placeholder="자유롭게 작성해 주세요..."
          />
          <div className="text-right text-sm text-gray-500">
            {MAX_CHARS - introduction.length}자 남음
          </div>
        </div>

        <div className="p-5 border-t border-gray-200 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition shadow-lg"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 프로필 수정 섹션 컴포넌트 ---
export const EditProfileSection: React.FC<EditProfileSectionProps> = ({ initialData, onComplete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for supported fields
  const [job, setJob] = useState('');
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('');
  const [introduction, setIntroduction] = useState('');

  // Initialize state when data is loaded
  useEffect(() => {
    if (initialData) {
      setJob(initialData.job || '');
      setLocation(initialData.location || '');
      setLanguage(initialData.languages || ''); // Note: 'languages' in interface, 'language' in DB
      setIntroduction(initialData.introduction || '');
    }
  }, [initialData]);

  const handleSaveIntro = (intro: string) => {
    setIntroduction(intro);
  };

  const handleSubmit = () => {
    // Build update payload
    const payload = {
      job,
      location,
      language,
      introduction
    };
    onComplete(payload);
  };

  return (
    <div className="space-y-12">

      {/* 1. 프로필 이미지 및 설명 */}
      <div className="flex flex-col md:flex-row md:items-start md:space-x-10 pb-8">
        <div className="relative flex-shrink-0 mb-6 md:mb-0">
          <div className="w-32 h-32 rounded-full bg-black flex items-center justify-center text-5xl text-white font-bold"
            style={initialData?.profileImage ? { backgroundImage: `url(${initialData.profileImage})`, backgroundSize: 'cover' } : {}}>
            {!initialData?.profileImage && initialData?.name?.charAt(0)}
          </div>
          {/* 이미지 업로드 기능은 추후 구현 */}
          <button className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 p-2 bg-white border border-gray-300 rounded-full shadow-md text-xs text-gray-700 flex items-center whitespace-nowrap">
            <Camera className="w-3 h-3 mr-1" /> 편집
          </button>
        </div>

        <div className="flex-1 mt-6 md:mt-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">프로필</h2>
          <p className="text-gray-500 max-w-lg">
            커뮤니티 신뢰 구축을 위해 프로필 정보가 호스트와 게스트에게 공개되며, 에어비앤비 플랫폼 전반에도 프로필이 표시될 수 있습니다. <a href="#" className="font-semibold underline">자세히 알아보기</a>
          </p>
        </div>
      </div>

      {/* 2. 정보 입력 필드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Supported Fields */}
        <EditItemCard icon={Briefcase} title="직업" placeholder="직업을 입력하세요" value={job} onChange={setJob} />
        <div className="md:col-span-2">
          <EditItemCard icon={Globe} title="거주지" placeholder="거주지를 입력하세요" value={location} onChange={setLocation} />
        </div>
        <EditItemCard icon={MessageSquare} title="구사 언어" placeholder="언어를 입력하세요" value={language} onChange={setLanguage} />

        {/* Unsupported Fields (Disabled for now or just visual) */}
        <EditItemCard icon={Globe} title="꼭 여행해 보고 싶은 장소" placeholder="아직 지원되지 않음" disabled />
        <EditItemCard icon={Clock} title="취미" placeholder="아직 지원되지 않음" disabled />
        <EditItemCard icon={PawPrint} title="반려동물" placeholder="아직 지원되지 않음" disabled />
        <EditItemCard icon={Calendar} title="출생 연도" placeholder="아직 지원되지 않음" disabled />
        <EditItemCard icon={GraduationCap} title="출신 학교" placeholder="아직 지원되지 않음" disabled />
        <EditItemCard icon={Lightbulb} title="나에 관한 흥미로운 사실" placeholder="아직 지원되지 않음" disabled />
        <EditItemCard icon={PenTool} title="내가 가진 쓸모없는 재능" placeholder="아직 지원되지 않음" disabled />
        <EditItemCard icon={Music} title="고등학생일 때 가장 좋아했던 노래" placeholder="아직 지원되지 않음" disabled />
        <EditItemCard icon={Heart} title="좋아하는 것" placeholder="아직 지원되지 않음" disabled />
        <EditItemCard icon={BookOpen} title="자서전 제목" placeholder="아직 지원되지 않음" disabled />
      </div>

      {/* 3. 자기소개 섹션 */}
      <div className="space-y-4 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-bold">자기소개</h3>
        <p className="text-gray-500">재치를 발휘해 작성해 보세요.</p>

        {introduction ? (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50 whitespace-pre-wrap">
            <p className="text-gray-700">{introduction}</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 text-sm font-semibold text-red-500 hover:text-red-600 transition underline"
            >
              자기소개 수정
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm font-semibold text-red-500 hover:text-red-600 transition"
          >
            자기소개 추가
          </button>
        )}
      </div>

      {/* 4. 완료 버튼 */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 py-4 flex justify-end z-10">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition shadow-lg"
        >
          완료
        </button>
      </div>

      {/* 5. 모달 렌더링 */}
      <IntroModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveIntro}
        initialValue={introduction}
      />
    </div>
  );
};