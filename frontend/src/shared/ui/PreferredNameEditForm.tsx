'use client';

import { useState } from 'react';

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
        setError('로그인이 필요합니다.');
        setIsLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3001/api/v1/users/profile', {
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
        setError('저장에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      console.error('선호하는 이름 저장 실패:', err);
      setError('저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        호스트와 게스트에게 표시되는 이름입니다.
      </p>
      <input
        type="text"
        value={preferredName}
        onChange={(e) => setPreferredName(e.target.value)}
        placeholder="선호하는 이름(선택사항)"
        className="block w-full border border-gray-300 rounded-md shadow-sm p-3 placeholder-gray-400"
      />

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