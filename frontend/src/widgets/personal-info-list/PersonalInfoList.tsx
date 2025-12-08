'use client';

import { useState, useEffect, useCallback } from 'react';
import { InfoRow } from "@/shared/ui/InfoRow";
import { useTranslations } from 'next-intl';

import { NameEditForm } from '@/shared/ui/NameEditForm';
import { PreferredNameEditForm } from '@/shared/ui/PreferredNameEditForm';
import { EmailEditForm } from '@/shared/ui/EmailEditForm';
import { PhoneEditForm } from '@/shared/ui/PhoneEditForm';


// 열린 폼을 식별하기 위한 타입
type OpenForm = 'name' | 'preferredName' | 'email' | 'phone' | null;

// 사용자 정보 타입
interface UserData {
    name?: string;
    email?: string;
    phone?: string;
    preferredName?: string;
}

// 이메일 마스킹 함수 (예: test@gmail.com -> t***@gmail.com)
const maskEmail = (email: string, notProvided: string): string => {
    if (!email) return notProvided;
    const [localPart, domain] = email.split('@');
    if (!domain) return email;
    const maskedLocal = localPart.charAt(0) + '***';
    return `${maskedLocal}@${domain}`;
};

// 전화번호 마스킹 함수 (예: 010-1234-5678 -> +82 **-****-5678)
const maskPhone = (phone: string, notProvided: string): string => {
    if (!phone) return notProvided;
    // 마지막 4자리만 표시
    const lastFour = phone.slice(-4);
    return `+82 **-****-${lastFour}`;
};

export const PersonalInfoList = () => {
    const t = useTranslations('personalInfo');
    const tCommon = useTranslations('common');

    // 현재 열려 있는 폼의 상태를 관리
    const [openForm, setOpenForm] = useState<OpenForm>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    // 사용자 정보 가져오기
    const fetchUserData = useCallback(async () => {
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
                setUserData(data);
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    // 특정 폼을 토글하는 핸들러
    const handleToggle = (formName: OpenForm) => {
        // 이미 열려 있는 폼을 다시 누르면 닫기 (토글)
        setOpenForm(openForm === formName ? null : formName);
    };

    // 폼을 닫는 함수 (수정 폼 내부에서 저장이 완료된 후 호출하기 위함)
    const closeForm = () => setOpenForm(null);

    // 저장 후 데이터 새로고침
    const handleSaveSuccess = async () => {
        closeForm();
        await fetchUserData();
    };

    if (loading) {
        return (
            <div className="max-w-2xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
                </div>
                <div className="text-gray-500">{tCommon('loading')}</div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
            </div>
            <section>

                {/* 실명 */}
                <InfoRow
                    label={t('legalName')}
                    value={userData?.name || tCommon('notProvided')}
                    onActionClick={() => handleToggle('name')}
                    isOpen={openForm === 'name'}
                    buttonText={tCommon('edit')}
                >
                    <NameEditForm
                        currentName={userData?.name || ''}
                        onSave={handleSaveSuccess}
                        onClose={closeForm}
                    />
                </InfoRow>

                {/* 선호하는 이름 */}
                <InfoRow
                    label={t('preferredName')}
                    value={userData?.preferredName || tCommon('notProvided')}
                    buttonText={userData?.preferredName ? tCommon('edit') : tCommon('add')}
                    onActionClick={() => handleToggle('preferredName')}
                    isOpen={openForm === 'preferredName'}
                >
                    <PreferredNameEditForm
                        currentPreferredName={userData?.preferredName || ''}
                        onSave={handleSaveSuccess}
                        onClose={closeForm}
                    />
                </InfoRow>

                {/* 이메일 주소 */}
                <InfoRow
                    label={t('email')}
                    value={maskEmail(userData?.email || '', tCommon('notProvided'))}
                    onActionClick={() => handleToggle('email')}
                    isOpen={openForm === 'email'}
                    buttonText={tCommon('edit')}
                >
                    <EmailEditForm
                        currentEmail={userData?.email || ''}
                        onSave={handleSaveSuccess}
                        onClose={closeForm}
                    />
                </InfoRow>

                {/* 전화번호 */}
                <InfoRow
                    label={t('phone')}
                    value={userData?.phone ? maskPhone(userData.phone, tCommon('notProvided')) : tCommon('notProvided')}
                    isBorderBottom={false}
                    buttonText={userData?.phone ? tCommon('edit') : tCommon('add')}
                    onActionClick={() => handleToggle('phone')}
                    isOpen={openForm === 'phone'}
                >
                    <PhoneEditForm
                        currentPhone={userData?.phone || ''}
                        onSave={handleSaveSuccess}
                        onClose={closeForm}
                    />
                </InfoRow>

            </section>
        </div>
    );
};