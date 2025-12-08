'use client';

import { useState } from 'react';

// 한국어 텍스트 상수
const TEXT = {
  phone: '전화번호',
  phoneDescription: '예약 관련 연락에 사용됩니다. 변경사항은 프로필에 반영됩니다.',
  enterPhone: '전화번호를 입력해주세요.',
  invalidPhone: '유효한 전화번호를 입력해주세요.',
  phoneNote: '연락처는 예약 확정 후 호스트 또는 에어비앤비에서만 연락하는 데 사용됩니다.',
  country: '국가/지역',
};

const COMMON_TEXT = {
  save: '저장',
  saving: '저장 중...',
  cancel: '취소',
  loginRequired: '로그인이 필요합니다.',
  saveFailed: '저장에 실패했습니다.',
  error: '오류가 발생했습니다.',
};

interface PhoneEditFormProps {
  currentPhone: string;
  onSave: () => void;
  onClose?: () => void;
}

export const PhoneEditForm = ({ currentPhone, onSave, onClose }: PhoneEditFormProps) => {
  const [phone, setPhone] = useState(currentPhone);
  const [countryCode] = useState('+82');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '');

    // 한국 전화번호 형식 (010-1234-5678)
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSave = async () => {
    if (!phone) {
      setError(TEXT.enterPhone);
      return;
    }

    // 숫자만 추출하여 10-11자리인지 확인
    const numbersOnly = phone.replace(/[^\d]/g, '');
    if (numbersOnly.length < 10 || numbersOnly.length > 11) {
      setError(TEXT.invalidPhone);
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

      // 전화번호 저장 (국가코드 포함)
      const fullPhone = countryCode + numbersOnly;

      const response = await fetch('/backend/api/v1/users/me', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: fullPhone }),
      });

      if (response.ok) {
        onSave();
      } else {
        setError(COMMON_TEXT.saveFailed);
      }
    } catch (err) {
      console.error('Phone save failed:', err);
      setError(COMMON_TEXT.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        {TEXT.phoneDescription}
      </p>

      {/* 국가/지역 드롭다운 */}
      <div>
        <label htmlFor="country" className="block text-xs font-medium text-gray-700">
          {TEXT.country}
        </label>
        <select
          id="country"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
          defaultValue="한국 (+82)"
          disabled
        >
          <option>한국 (+82)</option>
        </select>
      </div>

      {/* 전화번호 입력 */}
      <div>
        <label htmlFor="phone" className="block text-xs font-medium text-gray-700">
          {TEXT.phone}
        </label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="010-0000-0000"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 placeholder-gray-400"
          maxLength={13}
        />
      </div>

      <p className="text-xs text-gray-400">
        {TEXT.phoneNote}
      </p>

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