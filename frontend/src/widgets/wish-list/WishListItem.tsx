"use client";

import Image from "next/image";


import Link from "next/link";

interface WishListItemProps {
  title: string;
  location: string;
  rating: number;
  image: string;
  listingId: string | number;
}


export default function WishListItem({ title, location, rating, image, listingId }: WishListItemProps) {
  return (
    <Link href={`/rooms/${listingId}`} className="block cursor-pointer w-full">
      <div className="aspect-square relative w-full overflow-hidden rounded-2xl shadow group">
        <Image src={image} alt={title} fill className="object-cover transition duration-300 group-hover:scale-105" />
      </div>
      <div className="mt-3">
        <p className="font-semibold text-[17px] truncate">{title}</p>
        <p className="text-sm text-gray-500 truncate">{location}</p>
        <p className="text-sm mt-1">★ {rating}</p>
      </div>
    </Link>
  );
}
