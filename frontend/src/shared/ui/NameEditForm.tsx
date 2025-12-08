'use client';

import { useState } from 'react';

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
      setError('이름과 성을 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('로그인이 필요합니다.');
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
        setError('저장에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      console.error('이름 저장 실패:', err);
      setError('저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="mb-4 text-sm text-gray-500">
        다음 예약 전에 새로 실명 확인 절차를 거쳐야 합니다.
      </p>
      <div className="flex space-x-4">
        {/* 신분증에 기재된 이름 */}
        <div className="flex-1">
          <label htmlFor="givenName" className="text-xs text-gray-500">
            신분증에 기재된 이름(예: 길동)
          </label>
          <input
            type="text"
            id="givenName"
            value={givenName}
            onChange={(e) => setGivenName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 placeholder-gray-400"
            placeholder="이름"
          />
        </div>
        {/* 신분증에 기재된 성 */}
        <div className="flex-1">
          <label htmlFor="familyName" className="text-xs text-gray-500">
            신분증에 기재된 성(예: 홍)
          </label>
          <input
            type="text"
            id="familyName"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 placeholder-gray-400"
            placeholder="성"
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
          {isLoading ? '저장 중...' : '저장'}
        </button>
        <button
          onClick={onClose}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          취소
        </button>
      </div>
    </div>
  );
};