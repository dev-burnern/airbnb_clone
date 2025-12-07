"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DayData {
  day: number;
  price: number;
  available: boolean;
  minNights?: number;
}

interface CustomPricing {
  [key: string]: { price: number; minNights: number }; // key: "year-month-day"
}

export default function HostCalendarPage() {
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<{ month: number; day: number; year: number } | null>(null);
  const [customPricing, setCustomPricing] = useState<CustomPricing>({});
  const [editPrice, setEditPrice] = useState("64115");
  const [editMinNights, setEditMinNights] = useState(1);

  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

  // 월 생성 함수
  const generateMonths = (offset: number) => {
    const months = [];
    const baseDate = new Date(2024, 10, 1); // 2024년 11월 시작
    
    for (let i = 0; i < 2; i++) {
      const date = new Date(baseDate);
      date.setMonth(baseDate.getMonth() + offset + i);
      months.push({
        year: date.getFullYear(),
        month: date.getMonth(),
        label: `${date.getMonth() + 1}월 ${date.getFullYear()}`,
      });
    }
    return months;
  };

  const months = generateMonths(currentMonthOffset);

  // 달력 날짜 생성 함수 - useMemo로 캐싱하여 가격이 고정되도록
  const calendarData = useMemo(() => {
    return months.map((monthData) => {
      const days: (DayData | null)[] = [];
      const firstDay = new Date(monthData.year, monthData.month, 1).getDay();
      const totalDays = new Date(monthData.year, monthData.month + 1, 0).getDate();

      for (let i = 0; i < firstDay; i++) {
        days.push(null);
      }

      for (let i = 1; i <= totalDays; i++) {
        const dateKey = `${monthData.year}-${monthData.month}-${i}`;
        
        // 커스텀 가격이 있으면 사용, 없으면 기본 가격 생성
        if (customPricing[dateKey]) {
          days.push({
            day: i,
            price: customPricing[dateKey].price,
            available: true,
            minNights: customPricing[dateKey].minNights,
          });
        } else {
          // 날짜 기반으로 시드를 생성하여 일관된 가격 생성
          const seed = monthData.year * 10000 + monthData.month * 100 + i;
          const price = 30000 + ((seed * 9301 + 49297) % 233280) % 20000;
          const available = ((seed * 7919 + 31337) % 100) > 20; // 80% 확률로 available
          
          days.push({
            day: i,
            price: Math.floor(price / 1000) * 1000, // 1000원 단위로
            available,
            minNights: 1,
          });
        }
      }

      return days;
    });
  }, [currentMonthOffset, customPricing]); // customPricing이 변경될 때도 재생성

  const handlePrevMonth = () => {
    setCurrentMonthOffset(currentMonthOffset - 2);
    setSelectedDate(null); // 월 이동 시 선택 해제
  };

  const handleNextMonth = () => {
    setCurrentMonthOffset(currentMonthOffset + 2);
    setSelectedDate(null); // 월 이동 시 선택 해제
  };

  const handleDateClick = (monthIndex: number, day: number, currentPrice: number, currentMinNights: number) => {
    const monthData = months[monthIndex];
    
    // 같은 날짜를 다시 클릭하면 선택 해제
    if (selectedDate?.month === monthIndex && selectedDate?.day === day) {
      setSelectedDate(null);
    } else {
      setSelectedDate({ month: monthIndex, day, year: monthData.year });
      setEditPrice(currentPrice.toString());
      setEditMinNights(currentMinNights);
    }
  };

  const handleSave = () => {
    if (!selectedDate) return;

    const monthData = months[selectedDate.month];
    const dateKey = `${monthData.year}-${monthData.month}-${selectedDate.day}`;
    
    setCustomPricing({
      ...customPricing,
      [dateKey]: {
        price: parseInt(editPrice) || 64115,
        minNights: editMinNights,
      },
    });

    // 저장 후 선택 해제
    setSelectedDate(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Calendar */}
          <div className="col-span-9">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-semibold">달력</h1>
              <div className="flex gap-2">
                <button 
                  onClick={handlePrevMonth}
                  className="p-2 border border-gray-300 rounded-full hover:bg-gray-50"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={handleNextMonth}
                  className="p-2 border border-gray-300 rounded-full hover:bg-gray-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {months.map((monthData, monthIndex) => (
                <div key={`${monthData.year}-${monthData.month}`}>
                  <h3 className="font-semibold mb-4">{monthData.label}</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {daysOfWeek.map((day) => (
                      <div
                        key={day}
                        className="text-center text-xs font-semibold text-gray-500 pb-2"
                      >
                        {day}
                      </div>
                    ))}
                    {calendarData[monthIndex]?.map((day, index) => {
                      const isSelected = selectedDate?.month === monthIndex && selectedDate?.day === day?.day;
                      
                      return (
                        <div
                          key={index}
                          onClick={() => day?.available && handleDateClick(monthIndex, day.day, day.price, day.minNights || 1)}
                          className={`aspect-square border rounded-lg p-2 text-center transition ${
                            day
                              ? day.available
                                ? isSelected
                                  ? "border-black bg-black text-white cursor-pointer"
                                  : "border-gray-200 hover:border-gray-900 cursor-pointer"
                                : "border-gray-100 bg-gray-50 cursor-not-allowed"
                              : "border-transparent"
                          }`}
                        >
                          {day && (
                            <>
                              <div className={`text-sm font-medium ${day.available ? 'mb-1' : ''} ${isSelected ? 'text-white' : ''}`}>
                                {day.day}
                              </div>
                              {day.available ? (
                                <div className={`text-xs ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                                  ₩{day.price.toLocaleString()}
                                </div>
                              ) : (
                                <div className="text-xs text-gray-400 break-keep">
                                  -
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-3">
            <div className="sticky top-6 space-y-6">
              {selectedDate ? (
                // 날짜 선택 시 카드
                <div className="bg-black text-white rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-lg">
                    {months[selectedDate.month].label.split(' ')[0]} {selectedDate.day}일
                  </h3>
                  
                  <div className="border-t border-gray-700 pt-4">
                    <label className="block text-sm mb-2">1박당 요금</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">₩</span>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="font-semibold mb-3">맞춤설정</h4>
                    <label className="block text-sm mb-2">최소 숙박 일수</label>
                    <select 
                      value={editMinNights}
                      onChange={(e) => setEditMinNights(Number(e.target.value))}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                        <option key={num} value={num}>{num}박</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    onClick={handleSave}
                    className="w-full mt-4 px-4 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100"
                  >
                    저장
                  </button>
                </div>
              ) : (
                // 기본 사이드바
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
