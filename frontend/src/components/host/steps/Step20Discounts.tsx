"use client";

import React from "react";
import { Gift, Clock, Calendar, CalendarRange } from "lucide-react";

interface Step20DiscountsProps {
  formData: {
    discounts: string[];
  };
  onUpdate: (data: any) => void;
}

const Step20Discounts: React.FC<Step20DiscountsProps> = ({
  formData,
  onUpdate,
}) => {
  const discountOptions = [
    {
      id: "new_listing",
      icon: Gift,
      title: "신규 리스팅 프로모션",
      discount: "20%",
      description: "첫 3건의 예약에 20% 할인 제공.",
    },
    {
      id: "last_minute",
      icon: Clock,
      title: "막바지 예약 할인",
      discount: "25%",
      description: "체크인까지 남은 날짜가 14일 이하인 경우 25% 할인.",
    },
    {
      id: "weekly",
      icon: Calendar,
      title: "주간 할인",
      discount: "10%",
      description: "7박 이상 숙박에 적용되는 할인.",
    },
    {
      id: "monthly",
      icon: CalendarRange,
      title: "월간 할인",
      discount: "20%",
      description: "28박 이상의 숙박에 적용되는 할인.",
    },
  ];

  const toggleDiscount = (id: string) => {
    const current = formData.discounts;
    if (current.includes(id)) {
      onUpdate({
        ...formData,
        discounts: current.filter((item) => item !== id),
      });
    } else {
      onUpdate({
        ...formData,
        discounts: [...current, id],
      });
    }
  };

  return (
    <div className="py-6">
      <div className="w-full">
        <h1 className="text-3xl font-semibold mb-3">할인 추가</h1>
        <p className="text-sm text-gray-600 mb-8">
          더 빨리 예약을 받고 첫 후기를 받을 수 있도록 게스트의 관심을
          끌어보세요.
        </p>

        <div className="space-y-3">
          {discountOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.discounts.includes(option.id);

            return (
              <div
                key={option.id}
                className={`p-4 rounded-lg border-2 transition ${
                  isSelected
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-300 hover:border-gray-900"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon size={24} className="flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-semibold">{option.title}</h3>
                      <span className="text-xl font-bold text-pink-600">
                        {option.discount}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{option.description}</p>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleDiscount(option.id)}
                      className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Step20Discounts;
