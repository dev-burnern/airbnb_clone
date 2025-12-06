"use client";

import Image from "next/image";

interface Props {
  user?: {
    id: string;
    name: string;
    avatar: string;
  };
}

export default function MessageSideInfo({ user }: Props) {
  if (!user) {
    return (
      <aside className="w-[300px] border-l border-gray-200 p-8">
        <div className="flex items-center justify-center h-32 text-gray-400">
          대화를 선택하세요
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-[300px] border-l border-gray-200 p-8">
      <div className="flex flex-col items-center text-center">
        {/* 프로필 이미지 */}
        <Image
          src={user.avatar}
          alt={user.name}
          width={80}
          height={80}
          className="rounded-full object-cover mb-4"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/images/default_avatar.png";
          }}
        />

        {/* 이름 */}
        <p className="font-semibold text-lg">{user.name}</p>

        {/* 추가 정보 */}
        <div className="mt-6 w-full space-y-4">
          <button className="w-full py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
            프로필 보기
          </button>
        </div>
      </div>
    </aside>
  );
}