// src/app/main/page.tsx (UUID 형식 ID 적용)

import React from 'react';
import { AccommodationList } from '@/widgets/accommodation-list/AccommodationList';

// --- 1. 숙소 데이터 타입 정의 ---
interface AccommodationData {
  id: string;
  title: string;
  location: string;
  imageSrc: string;
  price: number;
  rating: number;
  dates: string;
  initialIsWished?: boolean;
}

// 🚨🚨🚨 'jeju-x' 대신 유효한 UUID 형식 ID를 사용합니다. 🚨🚨🚨
const JEJU_ACCOMMODATIONS: AccommodationData[] = [
  {
    id: '4c2c1f9c-5e92-4d1b-8f7a-0a7b6a4a1b02', // 유효한 UUID 1
    title: '구좌읍의 게스트용 별채',
    location: '제주, 대한민국',
    imageSrc: '/images/jeju_1.jpg', 
    price: 182588,
    rating: 4.88,
    dates: '3일 6일-8일',
    initialIsWished: true, 
  },
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', // 유효한 UUID 2
    title: '제주도의 집',
    location: '제주, 대한민국',
    imageSrc: '/images/jeju_2.jpg',
    price: 182588,
    rating: 4.98,
    dates: '1월 16일-18일',
    initialIsWished: false, 
  },
  {
    id: 'b0d1e2f3-a4b5-6c7d-8e9f-0123456789ab', // 유효한 UUID 3
    title: '제주도의 집',
    location: '제주, 대한민국',
    imageSrc: '/images/jeju_3.jpg',
    price: 273882,
    rating: 4.95,
    dates: '1월 9일-11일',
    initialIsWished: true,
  },
  // ... 필요에 따라 더 추가합니다.
];

const OSAKA_ACCOMMODATIONS: AccommodationData[] = [
  {
    id: 'c3f2d1e0-a9b8-7c6d-5e4f-3g2h1i0j9k8l', // 유효한 UUID 4
    title: '미나미구의 콘도',
    location: '나니와구, 오사카, 일본',
    imageSrc: '/images/osaka_1.jpg',
    price: 208994,
    rating: 4.88,
    dates: '12월 19일-21일',
    initialIsWished: false,
  },
  {
    id: 'd7e6f5g4-h3i2-j1k0-l9m8-n7o6p5q4r3s2', // 유효한 UUID 5
    title: '오사카시의 아파트',
    location: '나니와구, 오사카, 일본',
    imageSrc: '/images/osaka_2.jpg',
    price: 227738,
    rating: 4.93,
    dates: '12월 19일-21일',
    initialIsWished: false,
  },
];

// --- 2. 메인 페이지 컴포넌트 ---

const MainPage = () => {
  return (
    <div className="pt-20 pb-10"> 
      
      <AccommodationList 
        title="제주도의 숙소"
        data={JEJU_ACCOMMODATIONS as any} // 이제 데이터의 ID가 유효한 UUID 형식입니다.
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