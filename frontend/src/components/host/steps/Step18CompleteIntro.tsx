"use client";

import React from "react";

const Step18CompleteIntro: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full px-8">
      <div className="max-w-6xl w-full grid grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-5xl font-semibold mb-8 leading-tight">
            3단계 등록을 완료하세요
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            마지막으로, 예약 설정을 선택하고 요금을 설정한 후 숙소 등록을
            완료할 차례입니다.
          </p>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🏡</div>
              <p className="text-gray-500">숙소 외관 일러스트</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step18CompleteIntro;
