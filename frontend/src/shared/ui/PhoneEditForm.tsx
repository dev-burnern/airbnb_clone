'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface PhoneEditFormProps {
  currentPhone: string;
  onSave: () => void;
  onClose?: () => void;
}

export const PhoneEditForm = ({ currentPhone, onSave, onClose }: PhoneEditFormProps) => {
  const t = useTranslations('personalInfo');
  const tCommon = useTranslations('common');

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
      setError(t('enterPhone'));
      return;
    }

    // 숫자만 추출하여 10-11자리인지 확인
    const numbersOnly = phone.replace(/[^\d]/g, '');
    if (numbersOnly.length < 10 || numbersOnly.length > 11) {
      setError(t('invalidPhone'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError(tCommon('loginRequired'));
        setIsLoading(false);
        return;
      }

      // 전화번호 저장 (국가코드 포함)
      const fullPhone = countryCode + numbersOnly;

      const response = await fetch('http://localhost:3001/api/v1/users/me', {
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
        setError(tCommon('saveFailed'));
      }
    } catch (err) {
      console.error('Phone save failed:', err);
      setError(tCommon('error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        {t('phoneDescription')}
      </p>

      {/* 국가/지역 드롭다운 */}
      <div>
        <label htmlFor="country" className="block text-xs font-medium text-gray-700">
          {t('country')}
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
          {t('phone')}
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
        {t('phoneNote')}
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 disabled:opacity-50"
        >
          {isLoading ? tCommon('saving') : tCommon('save')}
        </button>
        <button
          onClick={onClose}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          {tCommon('cancel')}
        </button>
      </div>
    </div>
  );
};