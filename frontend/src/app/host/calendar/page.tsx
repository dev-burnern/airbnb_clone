"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import KeyInfoAlert from "@/components/host/KeyInfoAlert";

export default function HostCalendarPage() {
  const months = ["11월 2024", "12월 2024"];
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

  // 더미 달력 데이터
  const generateCalendarDays = (month: number) => {
    const days = [];
    const startDay = month === 0 ? 5 : 0; // 11월은 금요일 시작, 12월은 일요일 시작
    const totalDays = month === 0 ? 30 : 31;

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        price: Math.floor(Math.random() * 20000) + 30000,
        available: Math.random() > 0.3,
      });
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <KeyInfoAlert />

        <div className="grid grid-cols-12 gap-8">
          {/* Calendar */}
          <div className="col-span-9">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-semibold">달력</h1>
              <div className="flex gap-2">
                <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50">
                  <ChevronLeft size={20} />
                </button>
                <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {months.map((month, monthIndex) => (
                <div key={month}>
                  <h3 className="font-semibold mb-4">{month}</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {daysOfWeek.map((day) => (
                      <div
                        key={day}
                        className="text-center text-xs font-semibold text-gray-500 pb-2"
                      >
                        {day}
                      </div>
                    ))}
                    {generateCalendarDays(monthIndex).map((day, index) => (
                      <div
                        key={index}
                        className={`aspect-square border rounded-lg p-2 text-center ${
                          day
                            ? day.available
                              ? "border-gray-200 hover:border-gray-900 cursor-pointer"
                              : "border-gray-100 bg-gray-50"
                            : "border-transparent"
                        }`}
                      >
                        {day && (
                          <>
                            <div className="text-sm font-medium mb-1">
                              {day.day}
                            </div>
                            {day.available && (
                              <div className="text-xs text-gray-600">
                                ₩{day.price.toLocaleString()}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-3">
            <div className="sticky top-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">요금 설정</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">1박당 요금</span>
                    <span className="font-medium">₩64,115</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">주말 요금</span>
                    <span className="font-medium">₩64,115</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">주간 할인</span>
                    <span className="font-medium">10%</span>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 border border-gray-900 rounded-lg font-medium hover:bg-gray-50">
                  요금 관리
                </button>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold mb-4">예약 가능일 설정</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">예약 가능 기간</span>
                    <span className="font-medium">1-365일</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">체크인 마감</span>
                    <span className="font-medium">당일</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">최소 숙박일</span>
                    <span className="font-medium">1박</span>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 border border-gray-900 rounded-lg font-medium hover:bg-gray-50">
                  가능일 관리
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
