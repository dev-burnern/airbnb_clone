"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { AddToWishlistModal } from '@/components/wishlist/AddToWishlistModal';
import { CreateNewWishlistModal } from '@/components/wishlist/CreateNewWishlistModal';

interface AccommodationCardProps {
  id: string;
  title: string;
  location: string;
  imageSrc: string;
  price: number;
  rating: number;
  dates: string;
  isWished?: boolean;
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({
  id,
  title,
  location,
  imageSrc,
  price,
  rating,
  dates,
  isWished = false,
}) => {
  const [wished, setWished] = useState(isWished);
  // isWished prop이 변경될 때마다 wished 상태를 동기화
  React.useEffect(() => {
    setWished(isWished);
  }, [isWished]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 로그인 확인
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    setShowAddModal(true);
  };

  const handleCreateNewClick = () => {
    setShowAddModal(false);
    setShowCreateModal(true);
  };

  const handleBackToAdd = () => {
    setShowCreateModal(false);
    setShowAddModal(true);
  };

  const handleCloseAll = () => {
    setShowAddModal(false);
    setShowCreateModal(false);
  };

  // 위시리스트 추가 성공 시 호출되는 콜백
  const handleWishlistSuccess = () => {
    setWished(true);
    handleCloseAll();
  };

  const formatPrice = (p: number) => `₩${p.toLocaleString('ko-KR')}`;

  return (
    <>
      <Link href={`/rooms/${id}`} className="block group cursor-pointer relative">
        <div className="flex flex-col">
          {/* 이미지 영역 */}
          <div className="aspect-square relative w-full overflow-hidden rounded-xl">
            <Image
              src={imageSrc}
              alt={title}
              fill
              sizes="20vw" // Grid 5cols -> 20%
              className="object-cover transition duration-300 group-hover:scale-105"
            />

            {/* 위시리스트 하트 아이콘 (우측 상단 오버레이) */}
            {/* Link(a 태그) 내부에 button 태그는 유효하지 않으므로 div role="button"으로 대체 */}
            <div
              role="button"
              tabIndex={0}
              onClick={handleWishlistClick}
              className="absolute top-3 right-3 z-10 p-1.5 hover:scale-110 transition cursor-pointer"
              aria-label={wished ? "위시리스트에서 제거" : "위시리스트에 추가"}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleWishlistClick(e as any);
                }
              }}
            >
              <Heart
                className={`h-6 w-6 transition-colors ${wished
                  ? 'fill-red-500 stroke-red-500'
                  : 'fill-black/50 stroke-white hover:fill-red-500 hover:stroke-red-500'
                  }`}
              />
            </div>
          </div>

          {/* 숙소 정보 */}
          <div className="pt-2">
            {/* 위치 */}
            <div className="font-semibold text-sm truncate text-gray-900">
              {location}
            </div>

            {/* 제목 */}
            <div className="text-gray-500 text-xs truncate">
              {title}
            </div>

            {/* 날짜 정보 */}
            <div className="text-gray-500 text-xs">
              {dates}
            </div>

            {/* 가격 및 평점 */}
            <div className="flex items-center gap-1 mt-1">
              <div className="font-bold text-sm text-gray-900">
                {formatPrice(price)}
              </div>
              <span className="text-gray-500 text-xs">· 1박</span>
            </div>

            {/* 평점 */}
            {rating > 0 && (
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-xs">⭐</span>
                <span className="text-xs font-medium text-gray-900">{rating.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* 모달들 */}
      <AddToWishlistModal
        isOpen={showAddModal}
        onClose={handleCloseAll}
        listingId={id}
        onCreateNew={handleCreateNewClick}
        onSuccess={handleWishlistSuccess}
      />

      <CreateNewWishlistModal
        isOpen={showCreateModal}
        onClose={handleCloseAll}
        onBack={handleBackToAdd}
        listingId={id}
        onSuccess={handleWishlistSuccess}
      />
    </>
  );
};