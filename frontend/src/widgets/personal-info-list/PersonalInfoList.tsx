import { useState } from 'react';
import { InfoRow } from "@/shared/ui/InfoRow"; 

import { NameEditForm } from '@/shared/ui/NameEditForm';
import { PreferredNameEditForm } from '@/shared/ui/PreferredNameEditForm';
import { EmailEditForm } from '@/shared/ui/EmailEditForm';
import { PhoneEditForm } from '@/shared/ui/PhoneEditForm';


// 열린 폼을 식별하기 위한 타입
type OpenForm = 'name' | 'preferredName' | 'email' | 'phone' | null;

export const PersonalInfoList = () => {
  // 현재 열려 있는 폼의 상태를 관리
  const [openForm, setOpenForm] = useState<OpenForm>(null);

  // 특정 폼을 토글하는 핸들러
  const handleToggle = (formName: OpenForm) => {
    // 이미 열려 있는 폼을 다시 누르면 닫기 (토글)
    setOpenForm(openForm === formName ? null : formName);
  };
  
  // 폼을 닫는 함수 (수정 폼 내부에서 저장이 완료된 후 호출하기 위함)
  const closeForm = () => setOpenForm(null);
  
  // 🚨 참고: 이 값들은 버튼 렌더링에 사용되지 않지만, 로직 유지를 위해 남겨둡니다.
  const isEmailVerified = true; 
  const isPhoneVerified = false; 

  return (
    <div className="max-w-2xl">
        {/* 🎯 수정: mb-0에 mt-0과 mt-[-1rem]을 추가하여 상단 마진 제거 및 타이틀을 위로 끌어올림 */}
        <div className="mb-0 mt-0 mt-[-3rem]"> 
          <h1 className="text-3xl font-bold text-gray-900 mb-0">개인 정보</h1>
        </div>
        <section className="mt-[-5em]">
        
        {/* 실명 */}
        <InfoRow 
          label="실명" 
          value="민서 임" 
          onActionClick={() => handleToggle('name')} 
          isOpen={openForm === 'name'}
        >
          <NameEditForm onClose={closeForm} />
        </InfoRow>

        {/* 선호하는 이름 */}
        <InfoRow 
          label="선호하는 이름" 
          value="미제출" 
          buttonText="추가"
          onActionClick={() => handleToggle('preferredName')} 
          isOpen={openForm === 'preferredName'}
        >
          <PreferredNameEditForm onClose={closeForm} />
        </InfoRow>

        {/* 이메일 주소 */}
        <InfoRow 
          label="이메일 주소" 
          value="l***8@gmail.com"
          onActionClick={() => handleToggle('email')} 
          isOpen={openForm === 'email'}
        >
          <EmailEditForm onClose={closeForm} />
        </InfoRow>
        
        {/* 🗑️ 이메일 '확인' 버튼 렌더링 코드 제거 */}
        
        {/* 전화번호 */}
        <InfoRow 
          label="전화번호" 
          value="+82 **-****-2985" 
          isBorderBottom={false} // 마지막 항목은 경계선 제거
          onActionClick={() => handleToggle('phone')} 
          isOpen={openForm === 'phone'}
        >
          <PhoneEditForm onClose={closeForm} />
        </InfoRow>
        
        {/* 🗑️ 전화번호 '재인증 필요' 버튼 렌더링 코드 제거 */}
        
      </section>
    </div>
  );
};