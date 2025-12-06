"use client";

import { CheckCircle, X } from "lucide-react";
import { useState } from "react";

export default function KeyInfoAlert() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <CheckCircle size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-sm mb-1">주요 정보 확인하기</h3>
            <p className="text-sm text-gray-700">
              숙소를 게시하기 전에 필수 단계를 완료하세요.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
