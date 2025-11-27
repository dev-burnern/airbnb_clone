// src/entities/accommodation/ui/AccommodationCard.tsx

import React from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react'; 

interface AccommodationProps {
  id: string;
  title: string;
  location: string;
  imageSrc: string;
  price: number;
  rating: number;
  dates: string;
}

export const AccommodationCard: React.FC<AccommodationProps> = ({
  title,
  location,
  imageSrc,
  price,
  rating,
  dates,
}) => {
  // 간단한 통화 포맷 함수 (W: 원화)
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
        {/* 찜 버튼 (Feature layer에서 로직 구현) */}
        <div className="absolute top-3 right-3 z-10">
          <Heart className="h-6 w-6 fill-white stroke-white/80 transition hover:fill-red-500 hover:stroke-red-500" />
        </div>
      </div>

      {/* 2. 상세 정보 */}
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