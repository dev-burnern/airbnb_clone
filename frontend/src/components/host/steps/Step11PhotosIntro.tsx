"use client";

import React from "react";
import { Camera } from "lucide-react";

interface Step11PhotosIntroProps {
  onAddPhotos: () => void;
}

const Step11PhotosIntro: React.FC<Step11PhotosIntroProps> = ({
  onAddPhotos,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-semibold mb-4">주택 사진 추가하기</h1>
        <p className="text-gray-600 mb-12">
          숙소 등록을 시작하려면 사진 5장을 제출해야 합니다. 나중에 추가하거나
          변경하실 수 있습니다.
        </p>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-16 mb-8">
          <div className="flex flex-col items-center gap-6">
            <Camera size={64} className="text-gray-400" />
            <button
              onClick={onAddPhotos}
              className="px-6 py-3 border-2 border-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              사진 추가하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step11PhotosIntro;
