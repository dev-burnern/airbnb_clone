"use client";

import { MapPin } from "lucide-react";

interface Step6MapConfirmProps {
  address: {
    country: string;
    state: string;
    city: string;
    district: string;
    street: string;
    detail: string;
    postalCode: string;
  };
}

export default function Step6MapConfirm({ address }: Step6MapConfirmProps) {
  // 주소 문자열 생성
  const fullAddress = [
    address.country.replace(" - KR", ""),
    address.state,
    address.district,
    address.street,
    address.detail,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-semibold mb-4">
        핀이 놓인 위치가 정확한가요?
      </h1>
      <p className="text-gray-600 mb-12">
        주소는 게스트의 예약이 확정된 후에 공개됩니다.
      </p>

      {/* 지도 영역 (더미) */}
      <div className="relative w-full h-[500px] bg-gray-200 rounded-2xl overflow-hidden shadow-lg">
        {/* 더미 지도 배경 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50">
          {/* 격자 패턴으로 지도처럼 보이게 */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-10 grid-rows-10 h-full">
              {Array.from({ length: 100 }).map((_, i) => (
                <div key={i} className="border border-gray-400"></div>
              ))}
            </div>
          </div>
        </div>

        {/* 중앙 핀 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full">
          <MapPin className="w-12 h-12 text-red-500 fill-red-500 drop-shadow-lg" />
        </div>

        {/* 주소 표시 카드 */}
        <div className="absolute top-6 left-6 bg-white rounded-lg shadow-lg p-4 max-w-md">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {fullAddress || "주소를 입력해주세요"}
              </p>
              {address.postalCode && (
                <p className="text-xs text-gray-500 mt-1">
                  우편번호: {address.postalCode}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 확대/축소 컨트롤 (더미) */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2">
          <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition">
            <span className="text-xl font-bold text-gray-700">+</span>
          </button>
          <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition">
            <span className="text-xl font-bold text-gray-700">−</span>
          </button>
        </div>
      </div>

      {/* 안내 텍스트 */}
      <p className="text-sm text-gray-600 mt-6 text-center">
        핀을 드래그하여 정확한 위치로 이동할 수 있습니다.
      </p>
    </div>
  );
}
