import React from "react";

export default function FooterBottom() {
  return (
    <div className="border-t mt-6 pt-6 pb-4 text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-4">

      <p>
        © 2025 Airbnb, Inc. · 개인정보 처리방침 · 쿠키 정책 · 이용약관 ·
        한국의 변경된 환불 정책 · 회사 세부정보
      </p>

      <div className="flex items-center space-x-4 mt-2 md:mt-0">

      <span>한국어 (KR) · KRW</span>
      
      </div>

    </div>
  )

}