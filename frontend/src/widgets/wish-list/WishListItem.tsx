"use client";

import Image from "next/image";

interface WishListItemProps {
  title: string;
  location: string;
  rating: number;
  image: string;
}

export default function WishListItem({ title, location, rating, image }: WishListItemProps) {
  return (
    <div className="cursor-pointer w-full">
      {/* 이미지 */}
      <div className="relative w-full h-64 rounded-2xl overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      {/* 텍스트 */}
      <div className="mt-3">
        <p className="font-semibold text-[17px]">{title}</p>
        <p className="text-sm text-gray-500">{location}</p>
        <p className="text-sm mt-1">★ {rating}</p>
      </div>
    </div>
  );
}
