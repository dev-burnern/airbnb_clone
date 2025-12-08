'use client';

import { useState } from 'react';

// 한국어 텍스트 상수
const TEXT = {
  nameDescription: '신분증에 기재된 이름을 입력해주세요. 정확한 이름은 신분 확인 및 결제에 사용됩니다.',
  givenName: '이름',
  familyName: '성',
  enterNameAndSurname: '이름과 성을 모두 입력해주세요.',
};

const COMMON_TEXT = {
  save: '저장',
  saving: '저장 중...',
  cancel: '취소',
  loginRequired: '로그인이 필요합니다.',
  saveFailed: '저장에 실패했습니다.',
  error: '오류가 발생했습니다.',
};

interface NameEditFormProps {
  currentName: string;
  onSave: () => void;
  onClose?: () => void;
}

export const NameEditForm = ({ currentName, onSave, onClose }: NameEditFormProps) => {
  // 한국식 이름 처리: 첫 글자가 성, 나머지가 이름
  const [familyName, setFamilyName] = useState(currentName.charAt(0) || '');
  const [givenName, setGivenName] = useState(currentName.slice(1) || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!familyName || !givenName) {
      setError(TEXT.enterNameAndSurname);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError(COMMON_TEXT.loginRequired);
        setIsLoading(false);
        return;
      }

      const fullName = familyName + givenName;

      const response = await fetch('http://localhost:3001/api/v1/users/me', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: fullName }),
      });

      if (response.ok) {
        onSave();
      } else {
        setError(COMMON_TEXT.saveFailed);
      }
    } catch (err) {
      console.error('Name save failed:', err);
      setError(COMMON_TEXT.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="mb-4 text-sm text-gray-500">
        {TEXT.nameDescription}
      </p>
      <div className="flex space-x-4">
        {/* 신분증에 기재된 이름 */}
        <div className="flex-1">
          <label htmlFor="givenName" className="text-xs text-gray-500">
            {TEXT.givenName}
          </label>
          <input
            type="text"
            id="givenName"
            value={givenName}
            onChange={(e) => setGivenName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 placeholder-gray-400"
          />
        </div>
        {/* 신분증에 기재된 성 */}
        <div className="flex-1">
          <label htmlFor="familyName" className="text-xs text-gray-500">
            {TEXT.familyName}
          </label>
          <input
            type="text"
            id="familyName"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 placeholder-gray-400"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 disabled:opacity-50"
        >
          {isLoading ? COMMON_TEXT.saving : COMMON_TEXT.save}
        </button>
        <button
          onClick={onClose}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          {COMMON_TEXT.cancel}
        </button>
      </div>
    </div>
  );
};