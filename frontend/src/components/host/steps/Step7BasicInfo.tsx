"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";

interface Step7BasicInfoProps {
  formData: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  onUpdate: (data: any) => void;
}

const Step7BasicInfo: React.FC<Step7BasicInfoProps> = ({
  formData,
  onUpdate,
}) => {
  const handleIncrement = (field: string) => {
    onUpdate({ ...formData, [field]: formData[field as keyof typeof formData] + 1 });
  };

  const handleDecrement = (field: string) => {
    const currentValue = formData[field as keyof typeof formData];
    if (currentValue > 0) {
      onUpdate({ ...formData, [field]: currentValue - 1 });
    }
  };

  const items = [
    { key: "guests", label: "게스트" },
    { key: "bedrooms", label: "침실" },
    { key: "beds", label: "침대" },
    { key: "bathrooms", label: "욕실" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-8">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-semibold mb-4">
          숙소 기본 정보를 알려주세요
        </h1>
        <p className="text-gray-600 mb-12">
          침대 유형과 같은 세부 사항은 나중에 추가하실 수 있습니다.
        </p>

        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between py-6 border-b border-gray-200"
            >
              <span className="text-lg font-medium">{item.label}</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleDecrement(item.key)}
                  disabled={formData[item.key as keyof typeof formData] === 0}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center text-lg">
                  {formData[item.key as keyof typeof formData]}
                </span>
                <button
                  onClick={() => handleIncrement(item.key)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 transition"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step7BasicInfo;
