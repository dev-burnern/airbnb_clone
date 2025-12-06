"use client";

import React from "react";

interface Step15DescriptionProps {
  formData: {
    propertyDescription: string;
  };
  onUpdate: (data: any) => void;
}

const Step15Description: React.FC<Step15DescriptionProps> = ({
  formData,
  onUpdate,
}) => {
  const maxLength = 500;
  const currentLength = formData.propertyDescription.length;

  return (
    <div className="flex flex-col items-center justify-center h-full px-8">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-semibold mb-4">숙소 설명 작성하기</h1>
        <p className="text-gray-600 mb-12">숙소의 특징과 장점을 알려주세요.</p>

        <div className="space-y-4">
          <textarea
            value={formData.propertyDescription}
            onChange={(e) => {
              if (e.target.value.length <= maxLength) {
                onUpdate({
                  ...formData,
                  propertyDescription: e.target.value,
                });
              }
            }}
            placeholder="평화로운 오아시스와 같은 공간에서 휴식과 힐링의 시간을 가지세요."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none resize-none"
            rows={8}
          />
          <div className="text-right text-sm text-gray-500">
            {currentLength}/{maxLength}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step15Description;
