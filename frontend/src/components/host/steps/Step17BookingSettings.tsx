"use client";

import React from "react";
import { Calendar, Zap } from "lucide-react";

interface Step17BookingSettingsProps {
  formData: {
    bookingSetting: string;
  };
  onUpdate: (data: any) => void;
}

const Step17BookingSettings: React.FC<Step17BookingSettingsProps> = ({
  formData,
  onUpdate,
}) => {
  const options = [
    {
      id: "manual_first_5",
      icon: Calendar,
      title: "최초 5건 예약은 직접 검토 후 승인",
      badge: "추천",
      description:
        "첫 5건에 대해 수동 검토 후 승인, 그 이후 자동 예약 사용.",
    },
    {
      id: "instant",
      icon: Zap,
      title: "즉시 예약 사용",
      description: "게스트가 바로 예약할 수 있도록 즉시 예약 기능 설정.",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-8">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-semibold mb-4">예약 설정 선택</h1>
        <p className="text-gray-600 mb-12">
          이 설정은 언제든지 변경하실 수 있습니다.{" "}
          <a href="#" className="underline font-medium">
            자세히 알아보기
          </a>
        </p>

        <div className="space-y-4">
          {options.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.bookingSetting === option.id;

            return (
              <button
                key={option.id}
                onClick={() =>
                  onUpdate({ ...formData, bookingSetting: option.id })
                }
                className={`w-full p-6 rounded-lg border-2 transition text-left ${
                  isSelected
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-300 hover:border-gray-900"
                }`}
              >
                <div className="flex items-start gap-4">
                  <Icon size={32} className="flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{option.title}</h3>
                      {option.badge && (
                        <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-full">
                          {option.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">{option.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Step17BookingSettings;
