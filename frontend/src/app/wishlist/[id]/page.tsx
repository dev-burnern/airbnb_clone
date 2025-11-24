"use client";

import WishListItem from "@/widgets/wish-list/WishListItem";
import { useParams } from "next/navigation";

const sampleGroupData = [
  {
    id: 1,
    title: "최근 조회",
    info: "오늘",
    items: [
      {
        title: "Goseong-gun의 집",
        location: "오션뷰 스카이",
        rating: 4.7,
        image: "/images/sample1.jpg",
      },
    ],
  },
  {
    id: 2,
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
  },
  {
    id: 3,
    title: "제주",
    info: "게스트 4명",
    items: [
      {
        title: "제주시의 집",
        location: "자쿠지&족욕무료이벤트",
        rating: 4.95,
        image: "/images/sample6.jpg",
      },
    ],
  },
  {
    id: 4,
    title: "Yongsan-gu 2024",
    info: "게스트 2명",
    items: [
      {
        title: "한남동의 집",
        location: "레이트체크아웃 가능",
        rating: 4.92,
        image: "/images/sample7.jpg",
      },
    ],
  },
];

export default function WishlistGroupPage() {
  const params = useParams() as { id: string };
  const id = Number(params.id);

  const group = sampleGroupData.find((g) => g.id === Number(id)); 

  if (!group)
    return <p className="text-center text-gray-500">해당 위시리스트를 찾을 수 없습니다.</p>;

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">

      {/* 왼쪽 영역 */}
      <div>
        <h1 className="text-3xl font-bold mb-6">{group.title}</h1>

        <div className="flex gap-3 mb-6 flex-wrap">
          <button className="px-4 py-2 border rounded-full">날짜 입력하기</button>
          <button className="px-4 py-2 border rounded-full">{group.info}</button>
          <button className="px-4 py-2 border rounded-full">공유하기</button>
        </div>

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
