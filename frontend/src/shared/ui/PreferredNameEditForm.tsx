'use client';

import { useState } from 'react';

// 한국어 텍스트 상수
const TEXT = {
  preferredName: '선호하는 이름',
  preferredNameDescription: '호스트와 게스트에게 표시될 이름입니다. 이름이나 별명을 사용할 수 있습니다.',
};

const COMMON_TEXT = {
  save: '저장',
  saving: '저장 중...',
  cancel: '취소',
  loginRequired: '로그인이 필요합니다.',
  saveFailed: '저장에 실패했습니다.',
  error: '오류가 발생했습니다.',
};

interface PreferredNameEditFormProps {
  currentPreferredName: string;
  onSave: () => void;
  onClose?: () => void;
}

export const PreferredNameEditForm = ({ currentPreferredName, onSave, onClose }: PreferredNameEditFormProps) => {
  const [preferredName, setPreferredName] = useState(currentPreferredName);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError(COMMON_TEXT.loginRequired);
        setIsLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3001/api/v1/users/me', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferredName }),
      });

      if (response.ok) {
        onSave();
      } else {
        setError(COMMON_TEXT.saveFailed);
      }
    } catch (err) {
      console.error('Preferred name save failed:', err);
      setError(COMMON_TEXT.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        {TEXT.preferredNameDescription}
      </p>
      <input
        type="text"
        value={preferredName}
        onChange={(e) => setPreferredName(e.target.value)}
        placeholder={TEXT.preferredName}
        className="block w-full border border-gray-300 rounded-md shadow-sm p-3 placeholder-gray-400"
      />

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