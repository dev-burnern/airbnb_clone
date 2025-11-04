import React from "react";
import FooterColumn from "./FooterColumn";
import FooterBottom from "./FooterBottom";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm text-gray-600">
        <FooterColumn title ="다음 여행을 위한 추천 여행지"
          items={[
            "런던 - 저택 숙소",
            "리치몬드 - 휴가지 숙소",
            "브로큰보우 - 통나무집 숙소",
            "Government of Amsterdam - 저택 숙소",
            "웨스트팜비치 - 저택 숙소",
            "윌밍턴 - 저택 숙소",
          ]}
        />
        <FooterColumn title="에어비앤비 지원"
          items={[
            "도움말 센터",
            "안전 문제 관련 도움받기",
            "에어커버",
            "차별 반대",
            "장애인 지원",
            "예약 취소 옵션",
            "이웃 민원 신고",
          ]}
        />
        <FooterColumn title="호스팅"
          items={[
            "당신의 공간을 에어비앤비하세요",
            "에어비앤비에서 체험 호스팅하기",
            "에어비앤비에서 서비스 호스팅하기",
            "호스트를 위한 에어커버",
            "호스팅 자료",
            "커뮤니티 포럼",
            "책임감 있는 호스팅",
            "무료 호스팅 클래스 참여하기",
            "공동 호스트 찾기",
          ]}
        />
        <FooterColumn title="에어비앤비"
          items={[
            "2025 여름 업그레이드",
            "뉴스룸",
            "채용정보",
            "투자자 정보",
            "Airbnb.org 긴급 숙소",
          ]}
        />
      </div>

      <FooterBottom />
    </footer>
  );
}