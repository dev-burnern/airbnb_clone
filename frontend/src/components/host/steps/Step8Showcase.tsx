"use client";

import React from "react";

const Step8Showcase: React.FC = () => {
  return (
    <div className="py-6">
      <div className="grid grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-3xl font-semibold mb-6 leading-tight">
            숙소의 매력을 돋보이게 하세요
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            이 단계에서는 숙소에 갖춰진 편의시설과 사진 5장 이상을 추가한 후
            숙소 이름과 설명을 작성하시면 됩니다.
          </p>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full h-64 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-3">🏠</div>
              <p className="text-sm text-gray-500">아이소메트릭 숙소 이미지</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step8Showcase;
