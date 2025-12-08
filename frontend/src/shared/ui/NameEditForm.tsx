'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface NameEditFormProps {
  currentName: string;
  onSave: () => void;
  onClose?: () => void;
}

export const NameEditForm = ({ currentName, onSave, onClose }: NameEditFormProps) => {
  const t = useTranslations('personalInfo');
  const tCommon = useTranslations('common');

  // 한국식 이름 처리: 첫 글자가 성, 나머지가 이름
  const [familyName, setFamilyName] = useState(currentName.charAt(0) || '');
  const [givenName, setGivenName] = useState(currentName.slice(1) || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!familyName || !givenName) {
      setError(t('enterNameAndSurname'));
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
        setError(tCommon('saveFailed'));
      }
    } catch (err) {
      console.error('Name save failed:', err);
      setError(tCommon('error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="mb-4 text-sm text-gray-500">
        {t('nameDescription')}
      </p>
      <div className="flex space-x-4">
        {/* 신분증에 기재된 이름 */}
        <div className="flex-1">
          <label htmlFor="givenName" className="text-xs text-gray-500">
            {t('givenName')}
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
            {t('familyName')}
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