// src/features/login-and-security/AccessAndSharing.tsx

import { SimpleActionRow } from "@/shared/ui/SimpleActionRow";

export const AccessAndSharing = () => {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">접근 권한 공유</h2>
        <p className="text-gray-500 text-sm mb-6">
            접근 권한을 승인하기 전에 각 요청을 신중하게 검토하세요. 신뢰할 수 있는 기기로 계정에 로그인할 수 있도록 직원이나 동료에게 4자리 코드를 이메일로 보내드립니다.
        </p>

        <div className="border border-gray-200 p-6 rounded-lg bg-gray-50 flex items-start space-x-4">
            {/* 자물쇠 아이콘 */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600 mt-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2h2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2h2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">신뢰할 수 있는 사용자 기기 추가</h3>
                <p className="text-gray-700 text-sm">
                    요청을 승인하면, 계정에 제한 없이 접근할 수 있는 권한이 특정인에게 부여됩니다. 권한을 부여받은 사람은 호스트를 대신해 예약을 변경하고 메시지를 보낼 수 있습니다.
                </p>
                {/* 여기에 "요청 승인" 또는 "추가" 버튼이 들어갈 수 있습니다. 이미지에는 보이지 않지만, 기능을 위한 버튼을 추가할 수 있습니다. */}
            </div>
        </div>
      </section>
    </div>
  );
};