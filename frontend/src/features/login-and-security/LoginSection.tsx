// src/features/login-and-security/LoginSection.tsx

import { SimpleActionRow } from "@/shared/ui/SimpleActionRow";

interface DeviceLogProps {
    sessionType: '세션' | 'iOS';
    device: string;
    locationAndTime: string;
    actionButtonText?: string;
}

const DeviceLog = ({ sessionType, device, locationAndTime, actionButtonText }: DeviceLogProps) => (
    <div className="flex justify-between items-start py-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
            {/* 아이콘: 실제 구현 시 SVG 또는 컴포넌트 사용 */}
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

export const LoginSection = () => {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">로그인</h2>
        
        <SimpleActionRow
          title="비밀번호"
          valueDescription="생성되지 않음"
          actionButtonText="비밀번호 생성"
          isBorderBottom={true}
        />
      </section>

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
        {/* 필요한 경우 추가 기기 로그를 여기에 추가 */}
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">계정</h2>
        
        <SimpleActionRow
          title="계정 비활성화"
          valueDescription="이 작업은 되돌릴 수 없습니다."
          actionButtonText="비활성화"
          isBorderBottom={false}
        />
      </section>
    </div>
  );
};