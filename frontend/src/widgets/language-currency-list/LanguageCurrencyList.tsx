"use client";

import { useState, useEffect, useCallback } from 'react';
import { InfoRow } from "@/shared/ui/InfoRow";
import { useTranslations } from 'next-intl';

// 열린 폼을 식별하기 위한 타입
type OpenForm = 'language' | 'currency' | 'timezone' | null;

// 사용자 설정 타입
interface UserSettings {
    language?: string;
    currency?: string;
    timezone?: string;
}

// 언어 옵션
const LANGUAGE_OPTIONS = [
    { value: '한국어', label: '한국어' },
    { value: 'English', label: 'English' },
    { value: '日本語', label: '日本語' },
    { value: '中文', label: '中文' },
];

// 통화 옵션
const CURRENCY_OPTIONS = [
    { value: 'KRW', label: '한국 원 (₩)' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'JPY', label: 'JPY (¥)' },
];

// 시간대 옵션
const TIMEZONE_OPTIONS = [
    { value: 'Asia/Seoul', label: 'UTC+9 (Seoul)' },
    { value: 'Asia/Tokyo', label: 'UTC+9 (Tokyo)' },
    { value: 'America/New_York', label: 'UTC-5 (New York)' },
    { value: 'America/Los_Angeles', label: 'UTC-8 (Los Angeles)' },
    { value: 'Europe/London', label: 'UTC+0 (London)' },
];

// 값을 표시용 레이블로 변환
const getLanguageLabel = (value: string) =>
    LANGUAGE_OPTIONS.find(opt => opt.value === value)?.label || value || '한국어';

const getCurrencyLabel = (value: string) =>
    CURRENCY_OPTIONS.find(opt => opt.value === value)?.label || value || '한국 원 (₩)';

const getTimezoneLabel = (value: string) =>
    TIMEZONE_OPTIONS.find(opt => opt.value === value)?.label || value || '';

export const LanguageCurrencyList = () => {
    const t = useTranslations('languageCurrency');
    const tCommon = useTranslations('common');

    const [openForm, setOpenForm] = useState<OpenForm>(null);
    const [settings, setSettings] = useState<UserSettings>({});
    const [loading, setLoading] = useState(true);

    // 사용자 설정 가져오기
    const fetchSettings = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:3001/api/v1/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const result = await response.json();
                const data = result.data || result;
                const profile = data.profile || {};
                setSettings({
                    language: profile.language || '한국어',
                    currency: profile.currency || 'KRW',
                    timezone: profile.timezone || '',
                });
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleToggle = (formName: OpenForm) => {
        setOpenForm(openForm === formName ? null : formName);
    };

    const closeForm = () => setOpenForm(null);

    const handleSaveSuccess = async () => {
        closeForm();
        await fetchSettings();
    };

    // 언어 변경 후 페이지 새로고침 (번역 적용)
    const handleLanguageSaveSuccess = async () => {
        closeForm();
        // 언어 변경 후 페이지 새로고침하여 번역 적용
        window.location.reload();
    };

    // 언어 수정 폼
    const LanguageEditForm = () => {
        const [value, setValue] = useState(settings.language || '한국어');
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
                    body: JSON.stringify({ language: value }),
                });

                if (response.ok) {
                    handleLanguageSaveSuccess();
                } else {
                    setError(tCommon('error'));
                }
            } catch (err) {
                console.error('Save failed:', err);
                setError(tCommon('error'));
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div className="mt-4">
                <p className="text-gray-500 text-sm mt-2 mb-4">
                    {t('languageDescription')}
                </p>

                <select
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full p-3 border border-gray-400 rounded-md appearance-none bg-white"
                >
                    {LANGUAGE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-gray-900 text-white px-6 py-3 text-base rounded-lg mt-6 hover:bg-black transition disabled:opacity-50"
                >
                    {isLoading ? tCommon('saving') : tCommon('save')}
                </button>
            </div>
        );
    };

    // 통화 수정 폼
    const CurrencyEditForm = () => {
        const [value, setValue] = useState(settings.currency || 'KRW');
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
                    body: JSON.stringify({ currency: value }),
                });

                if (response.ok) {
                    handleSaveSuccess();
                } else {
                    setError(tCommon('error'));
                }
            } catch (err) {
                console.error('Save failed:', err);
                setError(tCommon('error'));
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div className="mt-4">
                <select
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full p-3 border border-gray-400 rounded-md appearance-none bg-white"
                >
                    {CURRENCY_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-gray-900 text-white px-6 py-3 text-base rounded-lg mt-6 hover:bg-black transition disabled:opacity-50"
                >
                    {isLoading ? tCommon('saving') : tCommon('save')}
                </button>
            </div>
        );
    };

    // 시간대 수정 폼
    const TimezoneEditForm = () => {
        const [value, setValue] = useState(settings.timezone || '');
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
                    body: JSON.stringify({ timezone: value }),
                });

                if (response.ok) {
                    handleSaveSuccess();
                } else {
                    setError(tCommon('error'));
                }
            } catch (err) {
                console.error('Save failed:', err);
                setError(tCommon('error'));
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div className="mt-4">
                <select
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full p-3 border border-gray-400 rounded-md appearance-none bg-white"
                >
                    <option value="">{t('selectTimezone')}</option>
                    {TIMEZONE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-gray-900 text-white px-6 py-3 text-base rounded-lg mt-6 hover:bg-black transition disabled:opacity-50"
                >
                    {isLoading ? tCommon('saving') : tCommon('save')}
                </button>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('title')}</h1>
                <div className="text-gray-500">{tCommon('loading')}</div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl">
            <div className="mb-0 mt-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-0">{t('title')}</h1>
            </div>

            <section>

                {/* 선호하는 언어 */}
                <InfoRow
                    label={t('preferredLanguage')}
                    value={getLanguageLabel(settings.language || '')}
                    onActionClick={() => handleToggle('language')}
                    isOpen={openForm === 'language'}
                    buttonText={tCommon('edit')}
                >
                    <LanguageEditForm />
                </InfoRow>

                {/* 선호하는 통화 */}
                <InfoRow
                    label={t('preferredCurrency')}
                    value={getCurrencyLabel(settings.currency || '')}
                    onActionClick={() => handleToggle('currency')}
                    isOpen={openForm === 'currency'}
                    buttonText={tCommon('edit')}
                >
                    <CurrencyEditForm />
                </InfoRow>

                {/* 시간대 */}
                <InfoRow
                    label={t('timezone')}
                    value={settings.timezone ? getTimezoneLabel(settings.timezone) : t('selectTimezone')}
                    isBorderBottom={false}
                    buttonText={tCommon('edit')}
                    onActionClick={() => handleToggle('timezone')}
                    isOpen={openForm === 'timezone'}
                >
                    <TimezoneEditForm />
                </InfoRow>
            </section>
        </div>
    );
};