"use client";

import React from "react";
import { Leaf, Sparkles, Users, Award, MapPin, Maximize } from "lucide-react";

interface Step16HighlightsProps {
  formData: {
    highlights: string[];
  };
  onUpdate: (data: any) => void;
}

const Step16Highlights: React.FC<Step16HighlightsProps> = ({
  formData,
  onUpdate,
}) => {
  const highlights = [
    { id: "peaceful", label: "평화로움", icon: Leaf },
    { id: "unique", label: "독특함", icon: Sparkles },
    { id: "family_friendly", label: "가족이 지내기에 적합", icon: Users },
    { id: "stylish", label: "세련됨", icon: Award },
    { id: "central", label: "중심부에 위치", icon: MapPin },
    { id: "spacious", label: "넓은 공간", icon: Maximize },
  ];

  const toggleHighlight = (id: string) => {
    const current = formData.highlights;
    
    if (current.includes(id)) {
      onUpdate({
        ...formData,
        highlights: current.filter((item) => item !== id),
      });
    } else if (current.length < 2) {
      onUpdate({
        ...formData,
        highlights: [...current, id],
      });
    }
  };

  const maxSelections = 2;
  const selectedCount = formData.highlights.length;

  return (
    <div className="py-6">
      <div className="w-full">
        <h1 className="text-3xl font-semibold mb-3">
          이제 주택에 대해 설명해주세요
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          숙소의 특징이 잘 드러나는 로고를 최대 {maxSelections}개까지 선택하실
          수 있습니다. 선택한 로고로 숙소 설명을 작성하실 수 있도록
          도와드릴게요.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {highlights.map((highlight) => {
            const Icon = highlight.icon;
            const isSelected = formData.highlights.includes(highlight.id);
            const isDisabled = !isSelected && selectedCount >= maxSelections;

            return (
              <button
                key={highlight.id}
                onClick={() => toggleHighlight(highlight.id)}
                disabled={isDisabled}
                className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition ${
                  isSelected
                    ? "border-gray-900 bg-gray-50"
                    : isDisabled
                    ? "border-gray-200 opacity-50 cursor-not-allowed"
                    : "border-gray-300 hover:border-gray-900"
                }`}
              >
                <Icon size={24} />
                <span className="text-sm font-medium text-center">
                  {highlight.label}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-sm text-gray-500 text-center">
          선택됨: {selectedCount}/{maxSelections}
        </p>
      </div>
    </div>
  );
};

export default Step16Highlights;
