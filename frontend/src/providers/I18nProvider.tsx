'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode, useEffect, useState } from 'react';

// 메시지 타입
type Messages = Record<string, Record<string, string>>;

// 지원 언어
const SUPPORTED_LOCALES = ['ko', 'en'];

// 기본 언어
const DEFAULT_LOCALE = 'ko';

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState(DEFAULT_LOCALE);
    const [messages, setMessages] = useState<Messages | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMessages = async () => {
            try {
                // 사용자 설정 언어 확인
                const token = localStorage.getItem('accessToken');
                let userLocale = DEFAULT_LOCALE;

                if (token) {
                    try {
                        const response = await fetch('http://localhost:3001/api/v1/users/me', {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            },
                        });

                        if (response.ok) {
                            const result = await response.json();
                            const data = result.data || result;
                            const profile = data.profile || {};

                            // 언어 설정을 로케일 코드로 변환
                            const langSetting = profile.language || '한국어';
                            if (langSetting === 'English' || langSetting === 'en') {
                                userLocale = 'en';
                            } else if (langSetting === '한국어' || langSetting === 'ko') {
                                userLocale = 'ko';
                            }
                        }
                    } catch (error) {
                        console.error('Failed to fetch user language setting:', error);
                    }
                }

                // 지원하는 언어인지 확인
                if (!SUPPORTED_LOCALES.includes(userLocale)) {
                    userLocale = DEFAULT_LOCALE;
                }

                // 메시지 로드
                const messageModule = await import(`../../messages/${userLocale}.json`);
                setMessages(messageModule.default);
                setLocale(userLocale);
            } catch (error) {
                console.error('Failed to load messages:', error);
                // 기본 한국어 메시지 로드
                const defaultMessages = await import('../../messages/ko.json');
                setMessages(defaultMessages.default);
            } finally {
                setLoading(false);
            }
        };

        loadMessages();
    }, []);

    if (loading || !messages) {
        return <>{children}</>;
    }

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
        </NextIntlClientProvider>
    );
}
