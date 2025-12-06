"use client";

import { Home, Compass, Bell } from "lucide-react";

interface Step1HostingTypeProps {
  selectedType: string;
  onSelect: (type: string) => void;
}

export default function Step1HostingType({
  selectedType,
  onSelect,
}: Step1HostingTypeProps) {
  const options = [
    {
      id: "숙소",
      title: "숙소",
      icon: Home,
      enabled: true,
    },
    {
      id: "체험",
      title: "체험",
      icon: Compass,
      enabled: false,
    },
    {
      id: "서비스",
      title: "서비스",
      icon: Bell,
      enabled: false,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-semibold mb-16">
        원하시는 호스팅 유형을 선택하세요
      </h1>

      <div className="space-y-4">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedType === option.id;

          return (
            <button
              key={option.id}
              onClick={() => option.enabled && onSelect(option.id)}
              disabled={!option.enabled}
              className={`w-full p-6 rounded-xl border-2 transition text-left ${
                isSelected
                  ? "border-gray-900 bg-gray-50"
                  : option.enabled
                  ? "border-gray-300 hover:border-gray-900"
                  : "border-gray-200 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{option.title}</h3>
                </div>
                <Icon className="w-8 h-8 text-gray-700" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
