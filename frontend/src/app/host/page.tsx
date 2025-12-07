"use client";

import { BookOpen } from "lucide-react";
import { useState } from "react";
import HostRegistrationModal from "@/components/host/HostRegistrationModal";

export default function HostDashboardPage() {
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"today" | "scheduled">("today");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab("today")}
            className={`pb-3 px-1 border-b-2 font-semibold ${
              activeTab === "today" 
                ? "border-gray-900" 
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            오늘
          </button>
          <button 
            onClick={() => setActiveTab("scheduled")}
            className={`pb-3 px-1 border-b-2 font-semibold ${
              activeTab === "scheduled" 
                ? "border-gray-900" 
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            예정
          </button>
        </div>

        {/* Empty State - 두 탭 모두 동일한 내용 표시 */}
        <div className="flex flex-col items-center justify-center py-20">
          <BookOpen size={64} className="text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">예약이 없습니다</h2>
          <p className="text-gray-600 mb-8">
            게스트가 숙소를 예약하면 여기에 표시됩니다.
          </p>
          <button 
            onClick={() => setHostModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#E61E4D] to-[#D70466] text-white rounded-lg font-semibold hover:from-[#D70466] hover:to-[#BD1E59] transition"
          >
            리스팅 만들기
          </button>
        </div>
      </div>

      {/* 호스트 등록 모달 */}
      <HostRegistrationModal
        isOpen={hostModalOpen}
        onClose={() => setHostModalOpen(false)}
      />
    </div>
  );
}
