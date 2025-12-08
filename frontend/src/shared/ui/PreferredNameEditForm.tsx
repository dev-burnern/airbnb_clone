'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface PreferredNameEditFormProps {
  currentPreferredName: string;
  onSave: () => void;
  onClose?: () => void;
}

export const PreferredNameEditForm = ({ currentPreferredName, onSave, onClose }: PreferredNameEditFormProps) => {
  const t = useTranslations('personalInfo');
  const tCommon = useTranslations('common');

  const [preferredName, setPreferredName] = useState(currentPreferredName);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError(tCommon('loginRequired'));
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
        setError(tCommon('saveFailed'));
      }
    } catch (err) {
      console.error('Preferred name save failed:', err);
      setError(tCommon('error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        {t('preferredNameDescription')}
      </p>
      <input
        type="text"
        value={preferredName}
        onChange={(e) => setPreferredName(e.target.value)}
        placeholder={t('preferredName')}
        className="block w-full border border-gray-300 rounded-md shadow-sm p-3 placeholder-gray-400"
      />

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