// src/app/auth/callback/page.tsx
"use client";

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const token = searchParams?.get('token');

        if (token) {
            // 1. 토큰 저장 (핵심)
            localStorage.setItem('accessToken', token);
            alert("GitHub 로그인에 성공했습니다."); 
            
            // 2. 메인 페이지로 이동
            router.push('/'); 
            
            // 3. (옵션) 기존 창 닫기 로직이 있다면 추가
        } else {
            alert("로그인 실패: 토큰을 받지 못했습니다.");
            router.push('/');
        }
    }, [searchParams, router]);

    return (
        <div className="flex justify-center items-center h-screen">
            <p>로그인 처리 중입니다...</p>
        </div>
    );
}