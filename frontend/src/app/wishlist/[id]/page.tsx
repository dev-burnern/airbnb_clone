"use client";

import WishListItem from "@/widgets/wish-list/WishListItem";
import Image from "next/image";

const sampleGroupData = {
  title: "Tongyeong-si 2025",
  info: "게스트 8명, 반려동물 1마리",
  items: [
    {
      title: "Goseong-gun의 집",
      location: "오션뷰 스카이",
      rating: 4.7,
      image: "/images/sample5.jpg",
    },
  ],
};

export default function WishlistGroupPage() {
  const group = sampleGroupData;

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">

      {/* 왼쪽 영역 (숙소 정보들) */}
      <div>
        <h1 className="text-3xl font-bold mb-6">{group.title}</h1>

        {/* 버튼들 */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <button className="px-4 py-2 border rounded-full">날짜 입력하기</button>
          <button className="px-4 py-2 border rounded-full">{group.info}</button>
          <button className="px-4 py-2 border rounded-full">공유하기</button>
        </div>

        {/* 숙소 리스트 */}
        <div className="space-y-8">
          {group.items.map((item, index) => (
            <WishListItem key={index} {...item} />
          ))}
        </div>
      </div>

      {/* 오른쪽 지도 영역 */}
      <div className="rounded-xl bg-gray-200 w-full h-[500px] flex items-center justify-center">
        <span className="text-gray-600">여기에 지도 들어갈 예정</span>
      </div>
    </main>
  );
}
