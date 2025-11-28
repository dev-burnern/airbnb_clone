"use client";

import { useState } from "react";
import { ToggleRow } from "@/shared/ui/ToggleRow";
import Link from "next/link";

export const PrivacyAndSecurityList = () => {
  // 실제 애플리케이션에서는 Redux/Context 등을 사용하여 상태를 관리해야 합니다.
  const [receiveConfirmation, setReceiveConfirmation] = useState(true);
  const [listingInfo, setListingInfo] = useState(true);
  
  // 후기 섹션 토글 상태
  const [displayResidence, setDisplayResidence] = useState(false);
  const [displayTravelType, setDisplayTravelType] = useState(false);
  const [displayAccommodationPeriod, setDisplayAccommodationPeriod] = useState(false);
  const [displayBookedServices, setDisplayBookedServices] = useState(false);

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">개인정보 보호</h1>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">수신 확인</h2>
        <ToggleRow
          title="수신 확인"
          description="내가 메시지를 확인했는지 상대방이 알 수 있습니다."
          isToggled={receiveConfirmation}
          onToggle={() => setReceiveConfirmation(!receiveConfirmation)}
          learnMoreText="자세히 알아보기"
          isBorderBottom={true}
        />
      </section>
      
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">리스팅</h2>
        <ToggleRow
          title="검색 엔진에 리스팅 정보 표시"
          description="이 옵션을 선택하면 구글과 같은 검색 엔진의 검색 결과에 리스팅 페이지가 표시됩니다."
          isToggled={listingInfo}
          onToggle={() => setListingInfo(!listingInfo)}
          learnMoreText="" // 이미지를 보니 여기에 '자세히 알아보기'가 없어 비워둡니다.
          isBorderBottom={true}
        />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">후기</h2>
        <p className="text-gray-500 text-sm mb-4">
            후기 작성 시 공유할 항목을 선택하세요. 설정을 업데이트하면 이전에 후기에 표시되는 항목은 바뀌지 않습니다.
            <button className="text-gray-900 underline text-sm font-medium hover:text-gray-600 whitespace-nowrap ml-1">
                자세히 알아보기
            </button>
        </p>
        
        {/* 후기 내 세부 토글 항목들 */}
        <ToggleRow
          title="내 거주 국가 및 도시 표시"
          description="예: 도시 및 국가"
          isToggled={displayResidence}
          onToggle={() => setDisplayResidence(!displayResidence)}
          isBorderBottom={true}
          learnMoreText={""}
        />
        <ToggleRow
          title="내 여행 유형 표시"
          description="예: 자녀 또는 반려동물 동반"
          isToggled={displayTravelType}
          onToggle={() => setDisplayTravelType(!displayTravelType)}
          isBorderBottom={true}
          learnMoreText={""}
        />
        <ToggleRow
          title="내 숙박 기간 표시"
          description="예: 며칠, 일주일 정도 등"
          isToggled={displayAccommodationPeriod}
          onToggle={() => setDisplayAccommodationPeriod(!displayAccommodationPeriod)}
          isBorderBottom={true}
          learnMoreText={""}
        />
        <ToggleRow
          title="내가 예약한 서비스 표시"
          description="예: 고급 브런치, 테이스팅 메뉴"
          isToggled={displayBookedServices}
          onToggle={() => setDisplayBookedServices(!displayBookedServices)}
          isBorderBottom={false} // 마지막 항목은 border-bottom 제거
          learnMoreText={""}
        />
      </section>
      
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">정보 공개 설정</h2>
        <div className="flex flex-col space-y-2">
            <Link href="#" className="flex justify-between py-4 border-b border-gray-200 hover:bg-gray-50 -mx-4 px-4 rounded-lg transition-colors">
                <span className="text-gray-900 font-medium">내 개인정보 요청하기</span>
                <span className="text-gray-500 text-xl">&gt;</span>
            </Link>
            <Link href="#" className="flex justify-between py-4 border-b border-gray-200 hover:bg-gray-50 -mx-4 px-4 rounded-lg transition-colors">
                <span className="text-gray-900 font-medium">쿠키 설정</span>
                <span className="text-gray-500 text-sm mt-1">에어비앤비에서 어떤 유형의 쿠키를 이용할지 설정하세요.</span>
                <span className="text-gray-500 text-xl">&gt;</span>
            </Link>
            <Link href="#" className="flex justify-between py-4 hover:bg-gray-50 -mx-4 px-4 rounded-lg transition-colors">
                <span className="text-gray-900 font-medium">계정 삭제하기</span>
                <span className="text-gray-500 text-xl">&gt;</span>
            </Link>
        </div>
        
        {/* 개인정보 보호 안내 블록 */}
        <div className="mt-8 bg-pink-50 border border-pink-200 p-4 rounded-lg flex items-start space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-700 mt-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2h2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2h2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <div>
                <p className="text-sm text-pink-800">
                    **에어비앤비는 개인정보 보호를 위해 최선을 다합니다.**
                    <br />
                    에어비앤비는 사용자 정보를 보호하기 위해 최선을 다하고 있습니다. 자세한 내용은 에어비앤비 개인정보 처리방침에서 확인하세요. 에어비앤비가 더 나은 서비스를 제공할 수 있도록, 소중한 의견을 알려주세요.
                </p>
            </div>
        </div>
      </section>

    </div>
  );
};