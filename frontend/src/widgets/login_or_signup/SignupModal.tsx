"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

type Props = {
    open: boolean;
    email: string;
    onClose?: () => void;
    onBack?: () => void;
    onSubmit?: () => void;
};

export default function SignupModal({
    open,
    email,
    onClose,
    onBack,
    onSubmit,
}: Props) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            setName("");
            setPassword("");
            setError(null);
        }
    }, [open]);

    if (!open) return null;

    const handleSignup = async () => {
        if (!name || !password) {
            setError("모든 필드를 입력해주세요.");
            return;
        }
        if (password.length < 6) {
            setError("비밀번호는 6자 이상이어야 합니다.");
            return;
        }
        setError(null);
        setIsLoading(true);

        try {
            // 1. 회원가입
            await axios.post('http://localhost:3001/api/v1/auth/register', {
                email,
                name,
                password
            });

            // 2. 자동 로그인 시도
            const loginResponse = await axios.post('http://localhost:3001/api/v1/auth/login', {
                email,
                password
            });

            // 3. 토큰 저장
            const token = loginResponse.data.data?.access_token || loginResponse.data.access_token;
            if (token) {
                localStorage.setItem('accessToken', token);
            }

            // 4. 완료 처리 (부모 컴포넌트에서 로그인 상태 변경)
            onSubmit?.();
        } catch (err) {
            console.error(err);
            setError("회원가입 또는 로그인 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center">
                    <button
                        type="button"
                        onClick={onBack}
                        className="mr-2 text-gray-700 hover:text-gray-900"
                    >
                        <span className="text-xl">&larr;</span>
                    </button>
                    <h3 className="flex-1 text-center text-lg font-semibold">회원가입 완료하기</h3>
                    <div className="w-6" />
                </div>

                <div className="p-6">
                    <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-600">이메일</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="mt-2 w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-600">이름</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="이름(예: 홍길동)"
                            className="mt-2 w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-xs font-medium text-gray-600">비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호 (6자 이상)"
                            className="mt-2 w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

                    <button
                        onClick={handleSignup}
                        disabled={isLoading}
                        className="w-full bg-pink-600 text-white py-3 rounded-md font-medium hover:bg-pink-700 disabled:opacity-50"
                    >
                        {isLoading ? "가입 중..." : "동의 및 계속하기"}
                    </button>

                    <p className="mt-4 text-xs text-gray-500 text-center">
                        동의 및 계속하기를 선택하면 에어비앤비의 서비스 약관, 결제 서비스 약관, 개인정보 처리방침, 차별 금지 정책에 동의하게 됩니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
