// src/features/login-and-security/LoginSection.tsx (수정)

import { useState } from 'react';
import { InfoRow } from "@/shared/ui/InfoRow"; 
import React from 'react'; 

interface DeviceLogProps {
    sessionType: '세션' | 'iOS';
    device: string;
    locationAndTime: string;
    actionButtonText?: string;
}

const DeviceLog = ({ sessionType, device, locationAndTime, actionButtonText }: DeviceLogProps) => (
    <div className="flex justify-between items-start py-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 flex items-center justify-center text-gray-500">
                {sessionType === '세션' ? '🖥️' : '📱'}
            </div>
            <div>
                <h4 className="text-gray-900 font-medium">{sessionType} · {device}</h4>
                <p className="text-gray-500 text-sm mt-1">{locationAndTime}</p>
            </div>
        </div>
        {actionButtonText && (
            <button className="text-gray-900 underline text-sm font-medium hover:text-gray-600 whitespace-nowrap ml-4">
                {actionButtonText}
            </button>
        )}
    </div>
);

// ----------------------------------------------------
// 비밀번호 변경 폼 컴포넌트 (제출 핸들러 추가)
// ----------------------------------------------------
interface PasswordFormContentProps {
    onCancel: () => void;
    onSubmit: (e: React.FormEvent) => void; 
}


export const LoginSection = () => {
    const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);

    const handlePasswordActionClick = () => {
        setIsPasswordFormOpen(true);
    };

    const handleCancel = () => {
        setIsPasswordFormOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("비밀번호 변경 로직 실행");
    };

    return (
        <div className="space-y-10">
            <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">로그인</h2>
                
                {isPasswordFormOpen ? (
                    // 폼이 열려있을 때: InfoRow 내부에 <form> 태그를 추가하고 handleSubmit 연결
                    <InfoRow
                        label="비밀번호"
                        value="변경 중"
                        buttonText="취소"
                        isBorderBottom={true}
                        onActionClick={handleCancel} // 취소 버튼으로 사용
                        isOpen={true}
                    >
                        <form onSubmit={handleSubmit} className="space-y-6 mt-6"> 
                            <div className="space-y-4">
                                {/* 새 비밀번호 입력 필드 */}
                                <div>
                                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-900">
                                        새 비밀번호
                                    </label>
                                    <input
                                        type="password"
                                        id="new-password"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10 px-3"
                                    />
                                </div>

                                {/* 비밀번호 확인 입력 필드 */}
                                <div>
                                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-900">
                                        비밀번호 확인
                                    </label>
                                    <input
                                        type="password"
                                        id="confirm-password"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10 px-3"
                                    />
                                </div>
                            </div>

                            {/* 비밀번호 변경 버튼 */}
                            <button
                                type="submit" // type="submit"은 유지하되, form의 onSubmit에서 처리
                                className="w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                비밀번호 변경
                            </button>
                        </form>
                    </InfoRow>
                ) : (
                    // 폼이 닫혀있으면 기본 InfoRow 표시
                    <InfoRow
                        label="비밀번호"
                        value="생성되지 않음"
                        buttonText="비밀번호 생성"
                        isBorderBottom={true}
                        onActionClick={handlePasswordActionClick}
                        isOpen={false}
                    />
                )}
            </section>

            {/* --- */}

            <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">기기 접속 기록</h2>
                
                <DeviceLog
                    sessionType="세션"
                    device="현재 세션"
                    locationAndTime="2025년 11월 12일 18:34"
                    actionButtonText="현재 해제"
                />
                <DeviceLog
                    sessionType="iOS"
                    device="unknown"
                    locationAndTime="Dongjak-gu, Seoul · 2023년 4월 12일 01:51"
                    actionButtonText="로그아웃"
                />
            </section>

            <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">계정</h2>
                
                <InfoRow
                    label="계정 비활성화"
                    value="이 작업은 되돌릴 수 없습니다."
                    buttonText="비활성화"
                    isBorderBottom={false}
                    onActionClick={() => alert('계정 비활성화 액션')}
                />
            </section>
        </div>
    );
};