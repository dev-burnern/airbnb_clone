// src/features/notifications/BenefitsAndUpdate.tsx

import { NotificationRow } from "@/shared/ui/NotificationRow";

export const BenefitsAndUpdate = () => {
  return (
    <div className="space-y-6">
      <section className="border-b border-gray-200 pb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">여행 팁 및 혜택</h2>
        <p className="text-gray-500 text-sm mb-4">맞춤 추천과 특별 할인으로 다음 여행 계획을 세워보세요.</p>
        
        <NotificationRow
          title="여행 아이디어 및 특가"
          description=""
          currentSetting="선택됨: 문자 메시지"
          isBorderBottom={true}
        />
        <NotificationRow
          title="여행 계획"
          description=""
          currentSetting="선택됨: 문자 메시지"
          isBorderBottom={false}
        />
      </section>

      <section className="pb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">에어비앤비 소식</h2>
        <p className="text-gray-500 text-sm mb-4">에어비앤비 혁신 소식을 확인하고 개선 방안을 제안해주세요.</p>
        
        <NotificationRow
          title="뉴스 및 프로그램"
          description=""
          currentSetting="선택됨: 문자 메시지"
          isBorderBottom={true}
        />
        <NotificationRow
          title="피드백"
          description=""
          currentSetting="선택됨: 문자 메시지"
          isBorderBottom={true}
        />
        <NotificationRow
          title="여행 규정"
          description=""
          currentSetting="선택됨: 문자 메시지"
          isBorderBottom={false}
        />
      </section>
      
      {/* 모든 마케팅 이메일에 대한 수신 거부 체크박스 */}
      <div className="flex items-start pt-6 border-t border-gray-200">
        <div className="flex items-center h-5">
          <input
            id="unsubscribe-marketing"
            name="unsubscribe-marketing"
            type="checkbox"
            className="focus:ring-gray-900 h-4 w-4 text-gray-900 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="unsubscribe-marketing" className="font-medium text-gray-900">
            모든 마케팅 이메일에 대한 수신 동의 취소
          </label>
          <p className="text-gray-500 mt-1">
            문자 메시지 수신에 동의하면, 에어비앤비에서 보내는 자동 마케팅 메시지를 +82 **-****-2985번으로 수신하는 데 동의하시는 것입니다. 다른 번호로 메시지를 받으려면, 개인정보 페이지에서 전화번호 설정을 업데이트하세요.
          </p>
        </div>
      </div>
    </div>
  );
};