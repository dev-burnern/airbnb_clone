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
    <div className="py-6">
      <div className="w-full text-center">
        <h1 className="text-3xl font-semibold mb-3">주택 사진 추가하기</h1>
        <p className="text-sm text-gray-600 mb-8">
          숙소 등록을 시작하려면 사진 5장을 제출해야 합니다. 나중에 추가하거나
          변경하실 수 있습니다.
        </p>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 mb-6">
          <div className="flex flex-col items-center gap-4">
            <Camera size={48} className="text-gray-400" />
            <button
              onClick={onAddPhotos}
              className="px-5 py-2 border-2 border-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition text-sm"
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
