"use client";

import React from "react";
import { Flame, Package, AlertTriangle, Wind } from "lucide-react";

interface Step10SafetyProps {
  formData: {
    safetyItems: string[];
  };
  onUpdate: (data: any) => void;
}

const Step10Safety: React.FC<Step10SafetyProps> = ({ formData, onUpdate }) => {
  const safetyItems = [
    { id: "smoke_alarm", label: "화재경보기", icon: Flame },
    { id: "first_aid", label: "구급 상자", icon: Package },
    { id: "fire_extinguisher", label: "소화기", icon: AlertTriangle },
    { id: "carbon_monoxide", label: "일산화탄소 경보기", icon: Wind },
  ];

  const toggleSafetyItem = (id: string) => {
    const current = formData.safetyItems;
    if (current.includes(id)) {
      onUpdate({
        ...formData,
        safetyItems: current.filter((item) => item !== id),
      });
    } else {
      onUpdate({
        ...formData,
        safetyItems: [...current, id],
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-8">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-semibold mb-12">
          다음과 같은 안전 관련 물품이 있나요?
        </h1>

        <div className="grid grid-cols-2 gap-4">
          {safetyItems.map((item) => {
            const Icon = item.icon;
            const isSelected = formData.safetyItems.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggleSafetyItem(item.id)}
                className={`flex flex-col items-center gap-4 p-8 rounded-lg border-2 transition ${
                  isSelected
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-300 hover:border-gray-900"
                }`}
              >
                <Icon size={32} />
                <span className="text-lg font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Step10Safety;
