"use client";

import { useState } from 'react';
import { InfoRow } from "@/shared/ui/InfoRow";

// 열린 폼을 식별하기 위한 타입
type OpenForm = 'language' | 'currency' | 'timezone' | null;

export const LanguageCurrencyList = () => {
    const [openForm, setOpenForm] = useState<OpenForm>(null);

    const handleToggle = (formName: OpenForm) => {
        setOpenForm(openForm === formName ? null : formName);
    };
    
    const closeForm = () => setOpenForm(null);

    // 💡 1. '선호하는 언어' 전용 수정 폼 (스크린샷 반영)
    const LanguageEditForm = ({ onClose }: { onClose: () => void }) => (
        <div className="mt-4">
            <div className="flex justify-end">
                <button 
                    onClick={onClose} 
                    className="text-gray-900 underline text-sm font-medium hover:text-gray-600 whitespace-nowrap"
                >
                    취소
                </button>
            </div>
            
            <p className="text-gray-500 text-sm mt-2 mb-4">
                선호하는 언어에 따라 에어비앤비 페이지의 내용과 커뮤니케이션 방식이 업데이트됩니다.
            </p>
            
            {/* 드롭다운 (임시 스타일) */}
            <select className="w-full p-3 border border-gray-400 rounded-md appearance-none bg-white">
                <option>한국어</option>
                <option>English</option>
            </select>
            
            {/* 저장 버튼 */}
            <button 
                onClick={onClose} 
                className="bg-gray-900 text-white px-6 py-3 text-base rounded-lg mt-6 hover:bg-black transition"
            >
                저장
            </button>
        </div>
    );
    
    // 💡 2. '시간대' 전용 수정 폼 (스크린샷 반영)
    const TimezoneEditForm = ({ onClose }: { onClose: () => void }) => (
        <div className="mt-4">
            <div className="flex justify-end">
                <button 
                    onClick={onClose} 
                    className="text-gray-900 underline text-sm font-medium hover:text-gray-600 whitespace-nowrap"
                >
                    취소
                </button>
            </div>
            
            {/* 드롭다운 (임시 스타일) */}
            <select className="w-full p-3 border border-gray-400 rounded-md appearance-none bg-white mt-2">
                <option>선택하세요...</option>
                <option>UTC+9 (서울)</option>
            </select>
            
            {/* 저장 버튼 */}
            <button 
                onClick={onClose} 
                className="bg-gray-900 text-white px-6 py-3 text-base rounded-lg mt-6 hover:bg-black transition"
            >
                저장
            </button>
        </div>
    );
    
    // 💡 3. '선호하는 통화' 수정 폼 (임시 폼 유지)
    const CurrencyEditForm = ({ onClose }: { onClose: () => void }) => (
        <div className="mt-4">
            <div className="flex justify-end">
                <button 
                    onClick={onClose} 
                    className="text-gray-900 underline text-sm font-medium hover:text-gray-600 whitespace-nowrap"
                >
                    취소
                </button>
            </div>
            
            {/* 드롭다운 (임시 스타일) */}
            <select className="w-full p-3 border border-gray-400 rounded-md appearance-none bg-white mt-2">
                <option>한국 원</option>
                <option>USD</option>
            </select>
            
            {/* 저장 버튼 */}
            <button 
                onClick={onClose} 
                className="bg-gray-900 text-white px-6 py-3 text-base rounded-lg mt-6 hover:bg-black transition"
            >
                저장
            </button>
        </div>
    );
    
    return (
        <div className="max-w-2xl">
            {/* 개인정보 UI 통일: 타이틀과 목록 간 간격 최소화 */}
            <div className="mb-0 mt-0 mt-[0rem]"> 
                <h1 className="text-3xl font-bold text-gray-900 mb-0">언어 및 통화</h1>
            </div>
            
            <section>
                
                {/* 선호하는 언어 */}
                <InfoRow 
                    label="선호하는 언어" 
                    value="한국어" 
                    onActionClick={() => handleToggle('language')} 
                    isOpen={openForm === 'language'}
                    // 폼이 열리면 버튼 텍스트를 '취소'로 바꾸지 않고, 폼 내부에 '취소' 버튼을 배치하는 UI를 따름
                    buttonText={openForm === 'language' ? '수정' : '수정'}
                >
                    <LanguageEditForm onClose={closeForm} />
                </InfoRow>

                {/* 선호하는 통화 */}
                <InfoRow 
                    label="선호하는 통화" 
                    value="한국 원" 
                    onActionClick={() => handleToggle('currency')} 
                    isOpen={openForm === 'currency'}
                    buttonText={openForm === 'currency' ? '수정' : '수정'}
                >
                    <CurrencyEditForm onClose={closeForm} />
                </InfoRow>

                {/* 시간대 */}
                <InfoRow 
                    label="시간대" 
                    value="미제출" 
                    isBorderBottom={false} 
                    buttonText={openForm === 'timezone' ? '수정' : '수정'}
                    onActionClick={() => handleToggle('timezone')} 
                    isOpen={openForm === 'timezone'}
                >
                    <TimezoneEditForm onClose={closeForm} />
                </InfoRow>
            </section>
        </div>
    );
};