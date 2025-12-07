"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

// 날짜 유틸리티 함수
// 'YYYY-MM-DD' 형식의 문자열로 변환
const formatDate = (date: Date | null): string | null => {
    if (!date) return null;
    // Date 객체가 로컬 시간대 기준이므로, toISOString()을 사용하여 UTC로 변환 후 날짜만 추출
    return date.toISOString().split('T')[0]; 
};

// 'YYYY-MM-DD' 형식의 문자열을 Date 객체로 변환
const parseDate = (dateStr: string | null): Date | null => {
    if (!dateStr) return null;
    // 년, 월, 일을 추출하여 로컬 시간대 00:00:00으로 Date 객체 생성
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
};

// 여행지 데이터
const DESTINATIONS = [
    { name: "근처 체험 찾기", type: "experience", description: "가까운 곳에서 즐길 수 있는 체험을 찾아보세요.", icon: "✈️" },
    // 한국
    { name: "서울", type: "city", description: "대한민국의 수도", icon: "🏙️" },
    { name: "부산", type: "city", description: "해변으로 인기 있는 곳", icon: "🏖️" },
    { name: "제주", type: "city", description: "아름다운 섬", icon: "🏝️" },
    { name: "대구", type: "city", description: "대한민국 남동부 도시", icon: "🏘️" },
    // 해외
    { name: "일본", type: "country", description: "동아시아의 섬나라", icon: "🗾" },
    { name: "필리핀", type: "country", description: "동남아시아의 아름다운 섬", icon: "🌴" },
    { name: "미국", type: "country", description: "북아메리카 대륙", icon: "🗽" },
];

// 게스트 유형
type GuestType = 'adults' | 'children' | 'infants' | 'pets';

// 활성화된 검색 필드 유형
type ActiveField = 'destination' | 'dates' | 'guests' | null;

// 날짜 상태 타입
type DateRange = {
    checkIn: string | null;
    checkOut: string | null;
};


export default function HeaderSearchBar() {
    const router = useRouter();
    const [activeField, setActiveField] = useState<ActiveField>(null);
    const [searchText, setSearchText] = useState("");
    const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
    const [dates, setDates] = useState<DateRange>({ checkIn: null, checkOut: null });
    const [guests, setGuests] = useState({
        adults: 0,
        children: 0,
        infants: 0,
        pets: 0,
    });
    // 달력에 표시할 시작 월을 현재 월로부터 얼마나 오프셋(떨어져 있는지)할지 결정
    const [monthOffset, setMonthOffset] = useState(0);

    // 검색바 전체를 참조하기 위한 ref
    const searchBarRef = useRef<HTMLDivElement>(null);

    // 컴포넌트 외부 클릭 시 드롭다운을 닫는 useEffect 훅
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
                setActiveField(null); // 드롭다운 닫기
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchBarRef]);

    // 검색어에 따른 여행지 필터링
    const filteredDestinations = useMemo(() => {
        const query = searchText.toLowerCase().trim();
        if (!query) return DESTINATIONS;
        return DESTINATIONS.filter(d => d.name.toLowerCase().includes(query));
    }, [searchText]);
    
    // 전체 게스트 수 계산
    const totalGuests = guests.adults + guests.children + guests.infants;

    const handleDestinationClick = (name: string) => {
        setSelectedDestination(name);
        setSearchText("");
        // 요청에 따라 드롭다운을 닫지 않음
    };

    const handleGuestChange = (type: GuestType, amount: 1 | -1) => {
        setGuests(prev => {
            const newCount = prev[type] + amount;
            if (newCount < 0) return prev;
            return { ...prev, [type]: newCount };
        });
    };

    // 검색 실행 핸들러
    const handleSearch = () => {
        const params = new URLSearchParams();
        
        // 여행지
        if (selectedDestination) {
            params.set('destination', selectedDestination);
        }
        
        // 날짜
        if (dates.checkIn) {
            params.set('checkIn', dates.checkIn);
        }
        if (dates.checkOut) {
            params.set('checkOut', dates.checkOut);
        }
        
        // 게스트
        if (totalGuests > 0) {
            params.set('guests', totalGuests.toString());
        }
        
        // 검색 페이지로 이동 (메인 페이지)
        router.push(`/?${params.toString()}`);
        setActiveField(null);
    };
    
    // 현재 월을 기준으로 달력 데이터 계산
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // 달력 데이터 생성 유틸리티
    const getMonthData = (year: number, month: number) => {
        const date = new Date(year, month, 1);
        const yearName = date.getFullYear();
        const monthName = date.getMonth() + 1;
        const firstDay = date.getDay(); // 0(일) ~ 6(토)
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return { year: yearName, month: month, monthName, daysInMonth, firstDay };
    };

    // 캘린더 데이터 (현재 offset 월, 현재 offset + 1 월)
    const baseMonth = new Date(currentYear, currentMonth + monthOffset);
    const month1Data = getMonthData(baseMonth.getFullYear(), baseMonth.getMonth());
    const month2Date = new Date(baseMonth.getFullYear(), baseMonth.getMonth() + 1);
    const month2Data = getMonthData(month2Date.getFullYear(), month2Date.getMonth());

    // 달력 이동 핸들러
    const handleMonthMove = (direction: 'prev' | 'next') => {
        setMonthOffset(prev => prev + (direction === 'next' ? 1 : -1));
    };

    // 날짜 선택 로직
    const handleDateSelect = useCallback((dateStr: string) => {
        const selectedDate = parseDate(dateStr)!;
        const checkInDate = parseDate(dates.checkIn);
        const checkOutDate = parseDate(dates.checkOut);

        if (!checkInDate || (checkInDate && checkOutDate)) {
            // 1. 선택된 날짜가 없거나 (초기 선택), 2. 체크인/체크아웃 모두 선택된 경우 (새로운 범위 시작)
            setDates({ checkIn: dateStr, checkOut: null });
        } else {
            // 체크인만 선택된 경우
            if (selectedDate < checkInDate) {
                // 선택한 날짜가 체크인보다 이전이면, 체크인을 새로 설정
                setDates({ checkIn: dateStr, checkOut: null });
            } else if (selectedDate.getTime() === checkInDate.getTime()) {
                // 같은 날짜를 다시 선택하면 체크인 해제
                setDates({ checkIn: null, checkOut: null });
            } else {
                // 체크아웃 설정
                setDates({ checkIn: dates.checkIn, checkOut: dateStr });
            }
        }
    }, [dates]);

    // -------------------------------------------------------------------------
    // 드롭다운 컴포넌트들
    // -------------------------------------------------------------------------

    const DestinationDropdown = () => (
        <div className="absolute top-full mt-6 -left-2 w-[350px] bg-white rounded-3xl shadow-2xl p-5 z-50 border border-gray-100">
            <h4 className="text-base font-semibold mb-4">추천 여행지</h4>
            <div className="space-y-3">
                {filteredDestinations.map((dest) => (
                    <div
                        key={dest.name}
                        onClick={() => handleDestinationClick(dest.name)}
                        className="flex items-center p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition group"
                    >
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl group-hover:bg-gray-200 transition">
                            {dest.icon}
                        </div>
                        <div className="ml-3">
                            <span className="text-sm font-medium text-gray-800 block">{dest.name}</span>
                            <span className="text-xs text-gray-500">{dest.description}</span>
                        </div>
                    </div>
                ))}
                {filteredDestinations.length === 0 && (
                    <p className="text-center text-gray-500 py-4">검색 결과가 없습니다.</p>
                )}
            </div>
        </div>
    );

    const DatesDropdown = () => (
        // 드롭다운 너비
        <div className="absolute top-full mt-6 left-1/2 -translate-x-1/2 -ml-10 w-[550px] bg-white rounded-3xl shadow-2xl p-5 z-50 border border-gray-100">
            
            {/* 캘린더 헤더 */}
            <div className="flex items-center justify-end px-4 mb-4">
                {/* 이전 달 버튼 (현재 월 이전으로 가지 않도록 막음) */}
                <button 
                    onClick={() => handleMonthMove('prev')}
                    disabled={monthOffset <= 0}
                    className={`p-2 rounded-full transition ${monthOffset > 0 ? 'border border-gray-300 hover:bg-gray-50' : 'text-gray-300 cursor-not-allowed'}`}
                >
                    <ChevronLeft size={18} />
                </button>
                {/* 다음 달 버튼 */}
                <button 
                    onClick={() => handleMonthMove('next')}
                    className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 ml-2"
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* 캘린더 본문 (2달) */}
            <div className="flex justify-between space-x-10">
                {/* 첫 번째 달 */}
                <CalendarMonth monthData={month1Data} dates={dates} onDateSelect={handleDateSelect} />
                {/* 두 번째 달 */}
                <CalendarMonth monthData={month2Data} dates={dates} onDateSelect={handleDateSelect} />
            </div>
        </div>
    );

    interface CalendarMonthProps {
        monthData: ReturnType<typeof getMonthData>;
        dates: DateRange;
        onDateSelect: (dateStr: string) => void;
    }

    const CalendarMonth: React.FC<CalendarMonthProps> = ({ monthData, dates, onDateSelect }) => {
        const { year, monthName, daysInMonth, firstDay, month } = monthData;
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        
        // 첫 주에 빈 칸 채우기
        for (let i = 0; i < firstDay; i++) {
            calendarDays.unshift(null as any);
        }
        
        const checkInDate = parseDate(dates.checkIn);
        
        // 🚨 핵심 수정 (1): checkOutDate를 다음 날 자정으로 설정하여 비교 오류를 방지합니다.
        let checkOutDateForRange = parseDate(dates.checkOut);
        if (checkOutDateForRange) {
            // getTime() 비교를 위해 하루를 더합니다. (예: 19일 00:00:00 -> 20일 00:00:00)
            // 새로운 Date 객체를 만들어 원본 dates.checkOut을 오염시키지 않도록 처리
            checkOutDateForRange = new Date(checkOutDateForRange.getTime()); 
            checkOutDateForRange.setDate(checkOutDateForRange.getDate() + 1);
        }

        const isDateInRange = (day: number) => {
            if (!day || !checkInDate || !checkOutDateForRange) return false;
            const currentDate = new Date(year, month, day);
            
            const currentTime = currentDate.getTime();
            const checkInTime = checkInDate.getTime();
            const checkOutTimeForRange = checkOutDateForRange.getTime();

            // 핵심 로직: 체크인 다음 날부터 (>) 체크아웃 날짜의 다음 날 자정 전까지 (<) 포함
            return currentTime > checkInTime && currentTime < checkOutTimeForRange;
        };
        
        const isCheckIn = (day: number) => {
            if (!day || !checkInDate) return false;
            const dateStr = formatDate(new Date(year, month, day));
            return dateStr === dates.checkIn;
        };

        const isCheckOut = (day: number) => {
            if (!day || !dates.checkOut) return false;
            const dateStr = formatDate(new Date(year, month, day));
            return dateStr === dates.checkOut;
        };

        const isPast = (day: number) => {
            if (!day) return true;
            const today = new Date();
            const date = new Date(year, month, day);
            // 당일 포함 과거는 선택 불가
            return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
        };

        return (
            <div className="w-1/2">
                <h5 className="text-center text-base font-semibold mb-4">{year}년 {monthName}월</h5>
                <div className="grid grid-cols-7 gap-y-1">
                    {days.map(day => (
                        <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">{day}</div>
                    ))}
                    {calendarDays.map((day, index) => {
                        if (!day) {
                            return <div key={index} className="h-10"></div>; // 빈 셀
                        }
                        
                        const dateStr = formatDate(new Date(year, month, day))!;
                        const isStart = isCheckIn(day);
                        const isEnd = isCheckOut(day);
                        const disabled = isPast(day);

                        // *수정: isDateInRange는 순수 중간 범위만 체크하며, isStart, isEnd와 배타적입니다.*
                        const isMidRange = isDateInRange(day) && !isStart && !isEnd;

                        let cellClasses = 'h-10 flex items-center justify-center text-sm font-medium transition cursor-pointer';

                        if (disabled) {
                            cellClasses += ' text-gray-300 cursor-not-allowed';
                        } else if (isStart || isEnd) {
                            cellClasses += ' text-white bg-gray-900 rounded-full z-10 relative';
                            // 시작/끝 날짜에서 회색 배경이 겹치지 않도록 테두리 라운딩 제거 (기존 로직 유지)
                            if (isStart && dates.checkOut) cellClasses += ' rounded-r-none';
                            if (isEnd && dates.checkIn) cellClasses += ' rounded-l-none';
                            if (isStart && isEnd) cellClasses = cellClasses.replace('rounded-r-none', '').replace('rounded-l-none', '');
                        } else if (isMidRange) {
                            // isMidRange일 때만 회색 배경을 칠합니다.
                            cellClasses += ' bg-gray-100 rounded-none hover:bg-gray-200 relative before:content-[""] before:absolute before:inset-0 before:bg-gray-100 before:z-0';
                        } else {
                            cellClasses += ' hover:bg-gray-100 rounded-full';
                        }
                        
                        // 범위 시작/끝이 아닌 중간 날짜의 배경을 채우기 위한 랩퍼
                        const wrapperClasses = isMidRange ? 'bg-gray-100' : '';
                        let additionalWrapperClasses = '';
                        // 체크인/체크아웃 날짜의 좌우 경계에 회색 배경을 채우는 클래스
                        if (isStart && dates.checkOut) {
                            additionalWrapperClasses = 'bg-gray-100 rounded-l-full';
                        } else if (isEnd && dates.checkIn) {
                            additionalWrapperClasses = 'bg-gray-100 rounded-r-full';
                        }

                        return (
                            <div 
                                key={index} 
                                // wrapperClasses는 중간 날짜에 대한 배경을, additionalWrapperClasses는 시작/끝의 인접 배경을 처리합니다.
                                className={`relative ${wrapperClasses} ${additionalWrapperClasses}`}
                            >
                                <div
                                    onClick={!disabled ? () => onDateSelect(dateStr) : undefined}
                                    className={cellClasses}
                                >
                                    <span className="relative z-10">{day}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };


    const GuestsDropdown = () => (
        <div className="absolute top-full mt-6 -right-8 w-[320px] bg-white rounded-3xl shadow-2xl p-5 z-50 border border-gray-100">
            <GuestCounter 
                label="성인" 
                description="13세 이상" 
                count={guests.adults} 
                onIncrease={() => handleGuestChange('adults', 1)} 
                onDecrease={() => handleGuestChange('adults', -1)} 
            />
            <div className="my-4 border-t border-gray-200"></div>
            <GuestCounter 
                label="어린이" 
                description="2~12세" 
                count={guests.children} 
                onIncrease={() => handleGuestChange('children', 1)} 
                onDecrease={() => handleGuestChange('children', -1)} 
            />
            <div className="my-4 border-t border-gray-200"></div>
            <GuestCounter 
                label="유아" 
                description="2세 미만" 
                count={guests.infants} 
                onIncrease={() => handleGuestChange('infants', 1)} 
                onDecrease={() => handleGuestChange('infants', -1)} 
            />
            <div className="my-4 border-t border-gray-200"></div>
            <GuestCounter 
                label="반려동물" 
                description="보조동물을 동반하시나요?" 
                count={guests.pets} 
                onIncrease={() => handleGuestChange('pets', 1)} 
                onDecrease={() => handleGuestChange('pets', -1)} 
            />
        </div>
    );

    const GuestCounter = ({ label, description, count, onIncrease, onDecrease }: any) => (
        <div className="flex items-center justify-between">
            <div>
                <div className="font-semibold text-gray-800">{label}</div>
                <div className="text-sm text-gray-500">{description}</div>
            </div>
            <div className="flex items-center space-x-3">
                <button 
                    onClick={onDecrease} 
                    disabled={count === 0}
                    className={`p-1 border rounded-full transition ${count > 0 ? 'border-gray-500 text-gray-700 hover:border-gray-900' : 'border-gray-200 text-gray-300 cursor-not-allowed'}`}
                >
                    <Minus size={16} />
                </button>
                <span className="w-5 text-center font-medium">{count}</span>
                <button 
                    onClick={onIncrease} 
                    className="p-1 border rounded-full border-gray-500 text-gray-700 hover:border-gray-900 transition"
                >
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );

    // -------------------------------------------------------------------------
    // 메인 렌더링
    // -------------------------------------------------------------------------

    const getGuestLabel = () => {
        if (totalGuests === 0) return "게스트 추가";
        return `게스트 ${totalGuests}명` + (guests.pets > 0 ? `, 반려동물 ${guests.pets}마리` : '');
    }
    
    const getDatesLabel = () => {
        if (dates.checkIn && dates.checkOut) {
            // 날짜 형식은 YYYY-MM-DD에서 월/일 형식으로 변경
            const ci = dates.checkIn.substring(5).replace('-', '/');
            const co = dates.checkOut.substring(5).replace('-', '/');
            return `${ci} - ${co}`;
        }
        if (dates.checkIn) {
            // 체크인만 선택된 경우, 체크아웃 날짜 추가 메시지 표시
            return `체크아웃: 날짜 추가`;
        }
        return "날짜 추가";
    }
    
    return (
        <div className="relative" ref={searchBarRef}>
            {/* 전체 검색바 너비 w-[700px] */}
            <div 
                className="flex items-center bg-white rounded-full shadow-md hover:shadow-lg transition w-[700px] p-2"
            >
                {/* 여행지 필드 */}
                <div 
                    className={`flex flex-col px-4 py-2 rounded-full cursor-pointer flex-[1.5] ${
                        activeField === 'destination' ? 'bg-white shadow-md' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveField('destination')}
                >
                    <span className="text-xs font-semibold text-gray-800">여행지</span>
                    <input
                        type="text"
                        placeholder={selectedDestination || "여행지 검색"}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onFocus={() => setActiveField('destination')}
                        className="text-sm text-gray-500 bg-transparent focus:outline-none w-full"
                    />
                </div>

                {/* 구분선 */}
                <div className="h-6 w-px bg-gray-300 mx-1"></div>

                {/* 날짜 필드 */}
                <div 
                    className={`flex flex-col px-4 py-2 rounded-full cursor-pointer flex-[1] ${
                        activeField === 'dates' ? 'bg-white shadow-md' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveField('dates')}
                >
                    <span className="text-xs font-semibold text-gray-800">날짜</span>
                    <span className="text-sm text-gray-500">{getDatesLabel()}</span>
                </div>
                
                {/* 구분선 */}
                <div className="h-6 w-px bg-gray-300 mx-1"></div>


                {/* 여행자 필드 및 검색 버튼 통합 */}
                <div 
                    className={`flex items-center px-2 py-2 rounded-full cursor-pointer flex-[1.3] ${
                        activeField === 'guests' ? 'bg-white shadow-md' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveField('guests')}
                >
                    <div className="flex flex-col px-2 flex-grow">
                        <span className="text-xs font-semibold text-gray-800">여행자</span>
                        <span className="text-sm text-gray-500">{getGuestLabel()}</span>
                    </div>
                    
                    {/* 검색 버튼 */}
                    <button 
                        onClick={(e) => { 
                            e.stopPropagation(); // 버튼 클릭 시 activeField 변경 방지
                            handleSearch(); // 검색 실행
                        }}
                        className="ml-3 bg-rose-500 text-white rounded-full p-3 hover:bg-rose-600 transition flex items-center justify-center shadow-md shrink-0"
                        aria-label="검색 실행"
                    >
                        <Search size={20} />
                    </button>
                </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* 드롭다운 영역 */}
            {/* ----------------------------------------------------------------- */}
            {activeField === 'destination' && <DestinationDropdown />}
            {activeField === 'dates' && <DatesDropdown />}
            {activeField === 'guests' && <GuestsDropdown />}

        </div>
    );
}