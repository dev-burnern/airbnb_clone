"use client";

import { useState } from 'react';
import { InfoRow } from "@/shared/ui/InfoRow";

// 열린 폼을 식별하기 위한 타입
type OpenForm = 'language' | 'currency' | 'timezone' | null;

export const LanguageCurrencyList = () => {
    const [openForm, setOpenForm] = useState<OpenForm>(null);

    const handleToggle = (formName: OpenForm) => {
        // 폼을 닫거나 (같은 버튼 재클릭) 열기 (다른 버튼 클릭)
        setOpenForm(openForm === formName ? null : formName);
    };
    
    // const closeForm = () => setOpenForm(null); // ❌ '취소' 버튼 삭제로 인해 이 함수는 더 이상 사용되지 않음

    // 💡 1. '선호하는 언어' 전용 수정 폼 (취소 버튼 제거)
    // 폼 닫기 (onClose)는 '저장' 버튼에만 연결됨
    const LanguageEditForm = ({ onClose }: { onClose: () => void }) => (
        <div className="mt-4">
            {/* ❌ 이전 '취소' 버튼을 포함하던 flex justify-end div 제거 */}
            
            <p className="text-gray-500 text-sm mt-2 mb-4">
                선호하는 언어에 따라 에어비앤비 페이지의 내용과 커뮤니케이션 방식이 업데이트됩니다.
            </p>
            
            {/* 드롭다운 (임시 스타일) */}
            <select className="w-full p-3 border border-gray-400 rounded-md appearance-none bg-white">
                <option>한국어</option>
                <option>English</option>
            </select>
            
            {/* 저장 버튼 (저장 후 폼을 닫는 역할) */}
            <button 
                onClick={onClose} 
                className="bg-gray-900 text-white px-6 py-3 text-base rounded-lg mt-6 hover:bg-black transition"
            >
                저장
            </button>
        </div>
    );
    
    // 💡 2. '시간대' 전용 수정 폼 (취소 버튼 제거)
    const TimezoneEditForm = ({ onClose }: { onClose: () => void }) => (
        <div className="mt-4">
            {/* ❌ 이전 '취소' 버튼을 포함하던 flex justify-end div 제거 */}
            
            {/* 드롭다운 (임시 스타일) */}
            <select className="w-full p-3 border border-gray-400 rounded-md appearance-none bg-white mt-2">
                <option>선택하세요...</option>
                <option>UTC+9 (서울)</option>
            </select>
            
            {/* 저장 버튼 (저장 후 폼을 닫는 역할) */}
            <button 
                onClick={onClose} 
                className="bg-gray-900 text-white px-6 py-3 text-base rounded-lg mt-6 hover:bg-black transition"
            >
                저장
            </button>
        </div>
    );
    
    // 💡 3. '선호하는 통화' 수정 폼 (취소 버튼 제거)
    const CurrencyEditForm = ({ onClose }: { onClose: () => void }) => (
        <div className="mt-4">
            {/* ❌ 이전 '취소' 버튼을 포함하던 flex justify-end div 제거 */}
            
            {/* 드롭다운 (임시 스타일) */}
            <select className="w-full p-3 border border-gray-400 rounded-md appearance-none bg-white mt-2">
                <option>한국 원</option>
                <option>USD</option>
            </select>
            
            {/* 저장 버튼 (저장 후 폼을 닫는 역할) */}
            <button 
                onClick={onClose} 
                className="bg-gray-900 text-white px-6 py-3 text-base rounded-lg mt-6 hover:bg-black transition"
            >
                저장
            </button>
        </div>
    );
    
    // InfoRow의 children 폼이 '저장' 버튼을 누르면 닫히도록 closeForm을 직접 전달
    const closeForm = () => setOpenForm(null);

    return (
        <div className="max-w-2xl">
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
                    // 폼이 열려도 버튼 텍스트는 '수정'을 유지
                    buttonText={'수정'} 
                >
                    <LanguageEditForm onClose={closeForm} />
                </InfoRow>

                {/* 선호하는 통화 */}
                <InfoRow 
                    label="선호하는 통화" 
                    value="한국 원" 
                    onActionClick={() => handleToggle('currency')} 
                    isOpen={openForm === 'currency'}
                    buttonText={'수정'}
                >
                    <CurrencyEditForm onClose={closeForm} />
                </InfoRow>

                {/* 시간대 */}
                <InfoRow 
                    label="시간대" 
                    value="미제출" 
                    isBorderBottom={false} 
                    buttonText={'수정'}
                    onActionClick={() => handleToggle('timezone')} 
                    isOpen={openForm === 'timezone'}
                >
                    <TimezoneEditForm onClose={closeForm} />
                </InfoRow>
            </section>
        </div>
    );
};