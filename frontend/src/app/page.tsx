// src/app/main/page.tsx (수정)

import React from 'react';
import { AccommodationList } from '@/widgets/accommodation-list/AccommodationList';
// --- 1. 더미 데이터 모킹 (initialIsWished 필드 추가) ---

interface AccommodationData {
  id: string;
  title: string;
  location: string;
  imageSrc: string;
  price: number;
  rating: number;
  dates: string;
  initialIsWished?: boolean; // 새롭게 추가된 필드
}

const JEJU_ACCOMMODATIONS: AccommodationData[] = [
  {
    id: 'jeju-1',
    title: '구좌읍의 게스트용 별채',
    location: '제주, 대한민국',
    imageSrc: '/images/jeju_1.jpg', 
    price: 182588,
    rating: 4.88,
    dates: '3일 6일-8일',
    initialIsWished: true, // 이 항목은 위시리스트에 추가된 상태로 시작
  },
  {
    id: 'jeju-2',
    title: '제주도의 집',
    location: '제주, 대한민국',
    imageSrc: '/images/jeju_2.jpg',
    price: 182588,
    rating: 4.98,
    dates: '1월 16일-18일',
    initialIsWished: false, 
  },
  {
    id: 'jeju-3',
    title: '제주도의 집',
    location: '제주, 대한민국',
    imageSrc: '/images/jeju_3.jpg',
    price: 273882,
    rating: 4.95,
    dates: '1월 9일-11일',
    initialIsWished: true, // 이 항목은 위시리스트에 추가된 상태로 시작
  },
  // ... 필요에 따라 더 추가합니다.
];

const OSAKA_ACCOMMODATIONS: AccommodationData[] = [
  {
    id: 'osaka-1',
    title: '미나미구의 콘도',
    location: '나니와구, 오사카, 일본',
    imageSrc: '/images/osaka_1.jpg',
    price: 208994,
    rating: 4.88,
    dates: '12월 19일-21일',
    initialIsWished: false,
  },
  {
    id: 'osaka-2',
    title: '오사카시의 아파트',
    location: '나니와구, 오사카, 일본',
    imageSrc: '/images/osaka_2.jpg',
    price: 227738,
    rating: 4.93,
    dates: '12월 19일-21일',
    initialIsWished: false,
  },
];

// --- 2. 메인 페이지 컴포넌트 (기존과 동일) ---

const MainPage = () => {
  return (
    <div className="pt-20 pb-10"> 
      
      <AccommodationList 
        title="제주도의 숙소"
        data={JEJU_ACCOMMODATIONS as any} // 타입 오류를 피하기 위해 임시로 'as any' 사용
      />
      
      <div className="my-10 border-t border-gray-100" /> {/* 섹션 간 구분선 */}

      <AccommodationList 
        title="다음 달에 예약 가능한 오사카 숙소"
        data={OSAKA_ACCOMMODATIONS as any}
      />
      
    </div>
  );
};

export default MainPage;