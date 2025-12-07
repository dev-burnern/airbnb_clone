"use client";

import React from "react";

interface Step14PropertyNameProps {
  formData: {
    propertyName: string;
  };
  onUpdate: (data: any) => void;
}

const Step14PropertyName: React.FC<Step14PropertyNameProps> = ({
  formData,
  onUpdate,
}) => {
  const maxLength = 50;
  const currentLength = formData.propertyName.length;

  return (
    <div className="py-6">
      <div className="w-full">
        <h1 className="text-3xl font-semibold mb-3">
          이제 주택에 이름을 지어주세요
        </h1>
        <p className="text-gray-600 mb-8">
          숙소 이름은 짧을수록 효과적입니다. 나중에 언제든지 변경할 수 있으니,
          너무 걱정하지 마세요.
        </p>

        <div className="space-y-3">
          <textarea
            value={formData.propertyName}
            onChange={(e) => {
              if (e.target.value.length <= maxLength) {
                onUpdate({ ...formData, propertyName: e.target.value });
              }
            }}
            placeholder="예: 바다가 보이는 아늑한 집"
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none resize-none text-sm"
            rows={2}
          />
          <div className="text-right text-sm text-gray-500">
            {currentLength}/{maxLength}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step14PropertyName;
