"use client";

// src/shared/ui/ToggleRow.tsx

interface ToggleRowProps {
  title: string;
  description: string;
  isToggled: boolean;
  onToggle: () => void;
  learnMoreText?: string;
  isBorderBottom?: boolean;
}

export const ToggleRow = ({
  title,
  description,
  isToggled,
  onToggle,
  learnMoreText,
  isBorderBottom = true,
}: ToggleRowProps) => {
  return (
    <div className={`flex justify-between items-start py-6 ${isBorderBottom ? "border-b border-gray-200" : ""}`}>
      <div className="flex-1 pr-4">
        <h3 className="text-gray-900 font-medium">{title}</h3>
        <p className="text-gray-500 text-sm mt-1">
          {description}
          {learnMoreText && (
            <button className="text-gray-900 underline text-sm font-medium hover:text-gray-600 whitespace-nowrap ml-1">
              {learnMoreText}
            </button>
          )}
        </p>
      </div>
      
      {/* 토글 스위치 (이미지 스타일 유사하게 구현) */}
      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 ${
          isToggled ? "bg-gray-900" : "bg-gray-200"
        }`}
        role="switch"
        aria-checked={isToggled}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            isToggled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};