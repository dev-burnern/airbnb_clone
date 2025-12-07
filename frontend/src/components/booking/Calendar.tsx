'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
    checkIn: string | null;
    checkOut: string | null;
    onDateSelect: (checkIn: string | null, checkOut: string | null) => void;
    minDate?: Date;
}

interface DayData {
    date: Date;
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isPast: boolean;
    isSelected: boolean;
    isInRange: boolean;
    isCheckIn: boolean;
    isCheckOut: boolean;
}

// 날짜 포맷 함수 (YYYY-MM-DD)
const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// 문자열을 Date 객체로 변환
const parseDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
};

// 월별 데이터 생성
const getMonthData = (year: number, month: number, checkIn: string | null, checkOut: string | null, minDate: Date): DayData[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDay = firstDayOfMonth.getDay(); // 0 = Sunday

    const days: DayData[] = [];

    // 이전 달의 날짜들 (빈 칸)
    for (let i = 0; i < startDay; i++) {
        const prevDate = new Date(year, month, -startDay + i + 1);
        days.push({
            date: prevDate,
            day: prevDate.getDate(),
            isCurrentMonth: false,
            isToday: false,
            isPast: true,
            isSelected: false,
            isInRange: false,
            isCheckIn: false,
            isCheckOut: false,
        });
    }

    // 현재 달의 날짜들
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const date = new Date(year, month, day);
        const dateStr = formatDate(date);
        const isPast = date < minDate;

        let isInRange = false;
        if (checkIn && checkOut) {
            const checkInDate = parseDate(checkIn);
            const checkOutDate = parseDate(checkOut);
            isInRange = date > checkInDate && date < checkOutDate;
        }

        days.push({
            date,
            day,
            isCurrentMonth: true,
            isToday: formatDate(date) === formatDate(today),
            isPast,
            isSelected: dateStr === checkIn || dateStr === checkOut,
            isInRange,
            isCheckIn: dateStr === checkIn,
            isCheckOut: dateStr === checkOut,
        });
    }

    return days;
};

// 단일 월 컴포넌트
const CalendarMonth: React.FC<{
    year: number;
    month: number;
    days: DayData[];
    onDayClick: (date: Date) => void;
}> = ({ year, month, days, onDayClick }) => {
    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

    return (
        <div className="flex-1">
            <h3 className="text-center font-semibold mb-4">{year}년 {monthNames[month]}</h3>
            <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((name) => (
                    <div key={name} className="text-center text-xs text-gray-500 font-medium py-2">
                        {name}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {days.map((dayData, idx) => {
                    if (!dayData.isCurrentMonth) {
                        return <div key={idx} className="h-10" />;
                    }

                    const isDisabled = dayData.isPast;
                    const baseClasses = "h-10 w-10 flex items-center justify-center rounded-full text-sm mx-auto transition-colors";

                    let classes = baseClasses;
                    if (isDisabled) {
                        classes += " text-gray-300 cursor-not-allowed";
                    } else if (dayData.isCheckIn || dayData.isCheckOut) {
                        classes += " bg-gray-900 text-white font-semibold";
                    } else if (dayData.isInRange) {
                        classes += " bg-gray-100 text-gray-900";
                    } else if (dayData.isToday) {
                        classes += " border border-gray-900 font-semibold cursor-pointer hover:bg-gray-100";
                    } else {
                        classes += " hover:bg-gray-100 cursor-pointer";
                    }

                    return (
                        <button
                            key={idx}
                            className={classes}
                            disabled={isDisabled}
                            onClick={() => !isDisabled && onDayClick(dayData.date)}
                        >
                            {dayData.day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// 메인 캘린더 컴포넌트
export default function Calendar({ checkIn, checkOut, onDateSelect, minDate }: CalendarProps) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const effectiveMinDate = minDate || today;

    const [currentMonth, setCurrentMonth] = useState(() => ({
        year: today.getFullYear(),
        month: today.getMonth(),
    }));

    // 두 달 데이터 생성
    const leftMonthData = useMemo(() =>
        getMonthData(currentMonth.year, currentMonth.month, checkIn, checkOut, effectiveMinDate),
        [currentMonth.year, currentMonth.month, checkIn, checkOut, effectiveMinDate]
    );

    const rightMonth = useMemo(() => {
        const nextMonth = currentMonth.month + 1;
        return {
            year: nextMonth > 11 ? currentMonth.year + 1 : currentMonth.year,
            month: nextMonth > 11 ? 0 : nextMonth,
        };
    }, [currentMonth]);

    const rightMonthData = useMemo(() =>
        getMonthData(rightMonth.year, rightMonth.month, checkIn, checkOut, effectiveMinDate),
        [rightMonth.year, rightMonth.month, checkIn, checkOut, effectiveMinDate]
    );

    // 날짜 선택 핸들러
    const handleDateSelect = (date: Date) => {
        const dateStr = formatDate(date);

        if (!checkIn || (checkIn && checkOut)) {
            // 체크인 선택 (초기화 또는 새로 선택)
            onDateSelect(dateStr, null);
        } else {
            // 체크아웃 선택
            const checkInDate = parseDate(checkIn);
            if (date <= checkInDate) {
                // 체크인보다 이전 날짜 선택 시 체크인으로 변경
                onDateSelect(dateStr, null);
            } else {
                onDateSelect(checkIn, dateStr);
            }
        }
    };

    // 이전/다음 달 이동
    const goToPrevMonth = () => {
        setCurrentMonth((prev) => {
            const newMonth = prev.month - 1;
            if (newMonth < 0) {
                return { year: prev.year - 1, month: 11 };
            }
            return { year: prev.year, month: newMonth };
        });
    };

    const goToNextMonth = () => {
        setCurrentMonth((prev) => {
            const newMonth = prev.month + 1;
            if (newMonth > 11) {
                return { year: prev.year + 1, month: 0 };
            }
            return { year: prev.year, month: newMonth };
        });
    };

    // 날짜 초기화
    const clearDates = () => {
        onDateSelect(null, null);
    };

    // 이전 달 버튼 비활성화 여부
    const canGoPrev = currentMonth.year > today.getFullYear() ||
        (currentMonth.year === today.getFullYear() && currentMonth.month > today.getMonth());

    return (
        <div className="bg-white rounded-xl p-6">
            {/* 네비게이션 */}
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={goToPrevMonth}
                    disabled={!canGoPrev}
                    className={`p-2 rounded-full ${canGoPrev ? 'hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={goToNextMonth}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* 두 달 표시 */}
            <div className="flex gap-8">
                <CalendarMonth
                    year={currentMonth.year}
                    month={currentMonth.month}
                    days={leftMonthData}
                    onDayClick={handleDateSelect}
                />
                <CalendarMonth
                    year={rightMonth.year}
                    month={rightMonth.month}
                    days={rightMonthData}
                    onDayClick={handleDateSelect}
                />
            </div>

            {/* 선택된 날짜 표시 및 초기화 */}
            <div className="mt-6 flex justify-between items-center text-sm">
                <div className="text-gray-600">
                    {checkIn && checkOut ? (
                        <span>{checkIn} ~ {checkOut}</span>
                    ) : checkIn ? (
                        <span>{checkIn} - 체크아웃 날짜를 선택하세요</span>
                    ) : (
                        <span>체크인 날짜를 선택하세요</span>
                    )}
                </div>
                {(checkIn || checkOut) && (
                    <button
                        onClick={clearDates}
                        className="text-gray-900 underline hover:text-gray-700"
                    >
                        날짜 지우기
                    </button>
                )}
            </div>
        </div>
    );
}
