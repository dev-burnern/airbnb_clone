"use client";

import React from "react";

interface Step21FinalDetailsProps {
  formData: {
    hostAddress: {
      country: string;
      state: string;
      city: string;
      district: string;
      street: string;
      detail: string;
      postalCode: string;
    };
  };
  onUpdate: (data: any) => void;
  onCreateListing: () => void;
}

const Step21FinalDetails: React.FC<Step21FinalDetailsProps> = ({
  formData,
  onUpdate,
  onCreateListing,
}) => {
  const updateAddress = (field: string, value: string) => {
    onUpdate({
      ...formData,
      hostAddress: {
        ...formData.hostAddress,
        [field]: value,
      },
    });
  };

  const canCreate =
    formData.hostAddress.state !== "" &&
    formData.hostAddress.city !== "" &&
    formData.hostAddress.district !== "";

  return (
    <div className="py-6">
      <div className="w-full">
        <h1 className="text-3xl font-semibold mb-3">
          몽 가지 세부사항을 입력해 주세요
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          호스트로 등록하기 위해 거주지 주소가 필요합니다.
        </p>

        <div className="space-y-4">
          {/* Country/Region */}
          <div>
            <label className="block text-xs font-medium mb-1">국가/지역</label>
            <select
              value={formData.hostAddress.country}
              onChange={(e) => updateAddress("country", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none text-sm"
            >
              <option value="한국 - KR">한국 - KR</option>
              <option value="미국 - US">미국 - US</option>
              <option value="일본 - JP">일본 - JP</option>
            </select>
          </div>

          {/* State/Province */}
          <div>
            <label className="block text-xs font-medium mb-1">시/도</label>
            <input
              type="text"
              value={formData.hostAddress.state}
              onChange={(e) => updateAddress("state", e.target.value)}
              placeholder="예: 서울특별시"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none text-sm"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-medium mb-1">시/군/구</label>
            <input
              type="text"
              value={formData.hostAddress.city}
              onChange={(e) => updateAddress("city", e.target.value)}
              placeholder="예: 강남구"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none text-sm"
            />
          </div>

          {/* District */}
          <div>
            <label className="block text-xs font-medium mb-1">도로명 주소</label>
            <input
              type="text"
              value={formData.hostAddress.district}
              onChange={(e) => updateAddress("district", e.target.value)}
              placeholder="예: 테헤란로 123"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none text-sm"
            />
          </div>

          {/* Street Address (Optional) */}
          <div>
            <label className="block text-xs font-medium mb-1">
              상세 주소 (선택사항)
            </label>
            <input
              type="text"
              value={formData.hostAddress.street}
              onChange={(e) => updateAddress("street", e.target.value)}
              placeholder="예: 101동 1001호"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none text-sm"
            />
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-xs font-medium mb-1">우편번호</label>
            <input
              type="text"
              value={formData.hostAddress.postalCode}
              onChange={(e) => updateAddress("postalCode", e.target.value)}
              placeholder="예: 06234"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Create Listing Button */}
        <button
          onClick={onCreateListing}
          disabled={!canCreate}
          className={`w-full mt-8 px-5 py-3 rounded-lg font-semibold text-base transition ${
            canCreate
              ? "bg-gradient-to-r from-[#E61E4D] to-[#D70466] text-white hover:from-[#D70466] hover:to-[#BD1E59]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          리스팅 만들기
        </button>
      </div>
    </div>
  );
};

export default Step21FinalDetails;
