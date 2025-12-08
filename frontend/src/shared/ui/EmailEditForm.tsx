'use client';

import { useState } from 'react';

// 한국어 텍스트 상수
const TEXT = {
  email: '이메일 주소',
  emailDescription: '알림, 영수증, 예약 확인 등을 위해 이메일 주소를 사용합니다.',
  enterEmail: '이메일을 입력해주세요.',
  invalidEmail: '유효한 이메일 주소를 입력해주세요.',
};

const COMMON_TEXT = {
  save: '저장',
  saving: '저장 중...',
  cancel: '취소',
  loginRequired: '로그인이 필요합니다.',
  saveFailed: '저장에 실패했습니다.',
  error: '오류가 발생했습니다.',
};

interface EmailEditFormProps {
  currentEmail: string;
  onSave: () => void;
  onClose?: () => void;
}

export const EmailEditForm = ({ currentEmail, onSave, onClose }: EmailEditFormProps) => {
  const [email, setEmail] = useState(currentEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    if (!email) {
      setError(TEXT.enterEmail);
      return;
    }

    if (!validateEmail(email)) {
      setError(TEXT.invalidEmail);
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

      const response = await fetch('http://localhost:3001/api/v1/users/me', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        onSave();
      } else {
        const errorData = await response.json();
        setError(errorData.message || COMMON_TEXT.saveFailed);
      }
    } catch (err) {
      console.error('Email save failed:', err);
      setError(COMMON_TEXT.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        {TEXT.emailDescription}
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={TEXT.email}
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