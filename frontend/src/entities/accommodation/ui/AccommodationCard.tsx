// src/entities/accommodation/ui/AccommodationCard.tsx (수정)

"use client";
import React from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react'; 
// Step 1에서 만든 훅을 가져옵니다.
import { useWishlistToggle } from '../../../features/wishlist/useWishlistToggle'; 

interface AccommodationProps {
  id: string; // 위시리스트 연동에 반드시 필요합니다.
  title: string;
  location: string;
  imageSrc: string;
  price: number;
  rating: number;
  dates: string;
  // 초기 위시리스트 상태를 받기 위한 Prop 추가 (백엔드에서 받아와야 함)
  initialIsWished?: boolean; 
}

export const AccommodationCard: React.FC<AccommodationProps> = ({
  id, // 훅에 전달하기 위해 추가
  title,
  location,
  imageSrc,
  price,
  rating,
  dates,
  initialIsWished = false, // 기본값 설정
}) => {
  // 훅을 사용하여 상태와 토글 함수를 가져옵니다.
  const { isWished, toggleWishlist, isLoading } = useWishlistToggle(initialIsWished, id); 

  const formatPrice = (p: number) => `${p.toLocaleString('ko-KR')}원`;

  return (
    <div className="flex flex-col cursor-pointer group">
      {/* 1. 이미지 및 찜 버튼 */}
      <div className="aspect-square relative w-full overflow-hidden rounded-xl">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover h-full w-full transition duration-300 group-hover:scale-105"
        />
        {/* 찜 버튼 (로직 연동) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(); // 위시리스트 토글 함수 호출
          }}
          disabled={isLoading} // API 호출 중에는 버튼 비활성화
          className="absolute top-3 right-3 z-10 p-1 rounded-full bg-white/50 hover:bg-white transition"
        >
          {/* isWished 상태에 따라 하트 아이콘 색상 변경 */}
          <Heart 
            className={`h-6 w-6 transition ${
              isWished ? 'fill-red-500 stroke-red-500' : 'fill-white stroke-white/80 hover:fill-red-500 hover:stroke-red-500'
            }`} 
          />
        </button>
      </div>

      {/* 2. 상세 정보 (기존과 동일) */}
      <div className="pt-2">
        <div className="font-semibold text-sm truncate">
          {location}
        </div>
        <div className="text-neutral-500 text-xs">
          {title}
        </div>
        <div className="text-neutral-500 text-xs">
          {dates}
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="font-semibold text-sm">
            {formatPrice(price)}
            <span className="font-normal text-xs ml-1">/박</span>
          </div>
          <div className="flex items-center text-xs">
            <span role="img" aria-label="star">⭐</span>
            <span className="ml-1">{rating.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};