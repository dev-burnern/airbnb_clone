"use client";

import Image from "next/image";
import Link from "next/link"; 
import { useState } from "react";

type WishlistGroup = {
  id: number;
  title: string;
  subtitle: string;
  images: string[];
};

const wishlistGroups: WishlistGroup[] = [
  {
    id: 1,
    title: "최근 조회",
    subtitle: "오늘",
    images: ["/images/sample1.jpg", "/images/sample2.jpg", "/images/sample3.jpg", "/images/sample4.jpg"],
  },
  {
    id: 2,
    title: "Tongyeong-si 2025",
    subtitle: "저장된 항목 1개",
    images: ["/images/sample5.jpg"],
  },
  {
    id: 3,
    title: "제주",
    subtitle: "저장된 항목 1개",
    images: ["/images/sample6.jpg"],
  },
  {
    id: 4,
    title: "Yongsan-gu 2024",
    subtitle: "저장된 항목 1개",
    images: ["/images/sample7.jpg"],
  },
];

export default function Wishlist() {
  const [deleteTarget, setDeleteTarget] = useState<WishlistGroup | null>(null);

  return (
    <>
      <div className="space-y-10">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {wishlistGroups.map((group) => (
            <Link key={group.id} href={`/wishlist/${group.id}`}>
              <div className="cursor-pointer relative">

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDeleteTarget(group);
                  }}
                  className="absolute top-3 left-3 bg-white/80 hover:bg-white text-gray-700 font-semibold w-7 h-7 rounded-full shadow z-10 flex items-center justify-center transition"
                >
                  ×
                </button>

                <div className="rounded-3xl overflow-hidden w-full h-64 bg-gray-200 grid grid-cols-2 grid-rows-2">
                  {group.images.slice(0, 4).map((img, index) => (
                    <div key={index} className="relative">
                      <Image src={img} alt={group.title} fill className="object-cover" />
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <p className="text-[17px] font-semibold">{group.title}</p>
                  <p className="text-sm text-gray-500">{group.subtitle}</p>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[350px] shadow-xl relative">

            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
              onClick={() => setDeleteTarget(null)}
            >
              ×
            </button>

            <h2 className="text-lg font-semibold mb-2">이 위시리스트를 삭제하시겠어요?</h2>
            <p className="text-gray-500 mb-6">
              '{deleteTarget.title}' 위시리스트가 영구적으로 삭제됩니다.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600"
              >
                취소
              </button>
              <button className="px-4 py-2 rounded-lg bg-black text-white">
                삭제
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
