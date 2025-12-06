"use client";

import {
  Home,
  Building2,
  Warehouse,
  Hotel,
  Ship,
  Trees,
  Caravan,
  Castle,
  Tent,
  Warehouse as Barn,
  Mountain,
  Palmtree,
} from "lucide-react";

interface Step3PropertyTypeProps {
  selectedType: string;
  onSelect: (type: string) => void;
}

export default function Step3PropertyType({
  selectedType,
  onSelect,
}: Step3PropertyTypeProps) {
  const propertyTypes = [
    { id: "주택", label: "주택", icon: Home },
    { id: "아파트", label: "아파트", icon: Building2 },
    { id: "별채", label: "별채", icon: Warehouse },
    { id: "B&B", label: "B&B", icon: Hotel },
    { id: "보트", label: "보트", icon: Ship },
    { id: "통나무집", label: "통나무집", icon: Trees },
    { id: "캠핑카", label: "캠핑카", icon: Caravan },
    { id: "성", label: "성", icon: Castle },
    { id: "동굴", label: "동굴", icon: Mountain },
    { id: "텐트", label: "텐트", icon: Tent },
    { id: "농장 숙소", label: "농장 숙소", icon: Barn },
    { id: "게스트용 별채", label: "게스트용 별채", icon: Palmtree },
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-semibold mb-16">
        다음 중 숙소를 가장 잘 설명하는 것은 무엇인가요?
      </h1>

      <div className="grid grid-cols-3 gap-4">
        {propertyTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;

          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={`p-6 rounded-xl border-2 transition flex flex-col items-start ${
                isSelected
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-300 hover:border-gray-900"
              }`}
            >
              <Icon className="w-8 h-8 mb-4 text-gray-700" />
              <span className="text-sm font-semibold">{type.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
