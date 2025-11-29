// src/features/notifications/AccountNotifications.tsx

import { NotificationRow } from "@/shared/ui/NotificationRow";

export const AccountNotifications = () => {
  return (
    <div className="space-y-6">
      <section className="border-b border-gray-200 pb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">계정 활동 및 정책</h2>
        <p className="text-gray-500 text-sm mb-4">예약과 계정 활동을 확인하고, 에어비앤비 주요 정책의 내용을 알아보세요.</p>
        
        <NotificationRow
          title="계정 활동"
          description=""
          currentSetting="선택됨: 이메일 및 문자 메시지"
          isBorderBottom={true}
        />
        <NotificationRow
          title="게스트 정책"
          description=""
          currentSetting="선택됨: 이메일 및 문자 메시지"
          isBorderBottom={false}
        />
      </section>

      <section className="border-b border-gray-200 pb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">알림</h2>
        <p className="text-gray-500 text-sm mb-4">예약, 리스팅, 계정 활동에 관한 중요한 알림을 받아보세요.</p>
        
        <NotificationRow
          title="알림"
          description=""
          currentSetting="선택됨: 문자 메시지"
          isBorderBottom={false}
        />
      </section>

      <section className="pb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">게스트·호스트가 보내는 메시지</h2>
        <p className="text-gray-500 text-sm mb-4">예약 전후 및 예약 기간 중에 호스트나 게스트와 연락하세요.</p>
        
        <NotificationRow
          title="메시지"
          description=""
          currentSetting="선택됨: 이메일 및 문자 메시지"
          isBorderBottom={false}
        />
      </section>
    </div>
  );
};