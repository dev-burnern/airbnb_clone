"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Step19WeekendPricingProps {
  formData: {
    basePrice: number;
    weekendPremium: number;
  };
  onUpdate: (data: any) => void;
}

const Step19WeekendPricing: React.FC<Step19WeekendPricingProps> = ({
  formData,
  onUpdate,
}) => {
  const calculateGuestPrice = (basePrice: number) => {
    // 에어비앤비 수수료 약 14% 가정
    return Math.round(basePrice * 1.14);
  };

  const calculateWeekendPrice = (basePrice: number, premium: number) => {
    return Math.round(basePrice * (1 + premium / 100));
  };

  const guestPrice = calculateGuestPrice(formData.basePrice);
  const weekendPrice = calculateWeekendPrice(
    formData.basePrice,
    formData.weekendPremium
  );

  return (
    <div className="flex flex-col items-center justify-center h-full px-8">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-semibold mb-4">주말 요금을 설정하세요</h1>
        <p className="text-gray-600 mb-12">
          금요일과 토요일에는 주말 할증을 추가하세요.
        </p>

        {/* Base Price Display */}
        <div className="text-center mb-12">
          <div className="text-7xl font-bold mb-4">
            ₩{formData.basePrice.toLocaleString()}
          </div>
          <p className="text-gray-600 text-lg">1박 기본 요금</p>
        </div>

        {/* Guest Payment Dropdown */}
        <div className="mb-8 p-4 border-2 border-gray-300 rounded-lg">
          <button className="w-full flex items-center justify-between">
            <span className="text-gray-600">게스트 지불 요금</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg">
                ₩{guestPrice.toLocaleString()}
              </span>
              <ChevronDown size={20} />
            </div>
          </button>
        </div>

        {/* Weekend Premium Slider */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">주말 프리미엄</h3>
            <span className="text-lg font-semibold">
              {formData.weekendPremium}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="99"
            value={formData.weekendPremium}
            onChange={(e) =>
              onUpdate({
                ...formData,
                weekendPremium: parseInt(e.target.value),
              })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
          />

          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>0%</span>
            <span>99%</span>
          </div>

          {formData.weekendPremium > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                주말(금요일, 토요일) 요금:{" "}
                <span className="font-semibold text-lg">
                  ₩{weekendPrice.toLocaleString()}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step19WeekendPricing;
