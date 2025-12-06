"use client";

import { Home, DoorOpen, BedDouble } from "lucide-react";

interface Step4GuestSpaceProps {
  selectedSpace: string;
  onSelect: (space: string) => void;
}

export default function Step4GuestSpace({
  selectedSpace,
  onSelect,
}: Step4GuestSpaceProps) {
  const spaceOptions = [
    {
      id: "전체",
      title: "공간 전체",
      description: "게스트가 숙소 전체를 단독으로 사용합니다.",
      icon: Home,
    },
    {
      id: "방",
      title: "방",
      description:
        "단독으로 사용하는 개인실이 있고, 공용 공간도 있는 형태입니다.",
      icon: DoorOpen,
    },
    {
      id: "다인실",
      title: "호스텔 내 다인실",
      description:
        "게스트는 객실 근무 직원이 상주하는 전문 숙박 시설인 호스텔 내부 다인실에서 머뭅니다.",
      icon: BedDouble,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-semibold mb-16">게스트가 사용할 숙소 유형</h1>

      <div className="space-y-4">
        {spaceOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedSpace === option.id;

          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`w-full p-6 rounded-xl border-2 transition text-left ${
                isSelected
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-300 hover:border-gray-900"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                  <p className="text-gray-600 text-sm">{option.description}</p>
                </div>
                <Icon className="w-8 h-8 text-gray-700 ml-4" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
