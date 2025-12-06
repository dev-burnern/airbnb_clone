"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useMessagesStore } from "@/entities/message/model/useMessagesStore";

export default function MessageList() {
  const { list, loading, error, fetchConversations } = useMessagesStore();

  // 컴포넌트 마운트 시 대화 목록 조회
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  if (loading && list.length === 0) {
    return (
      <aside className="w-[420px] border-r border-gray-200 h-screen overflow-y-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">메시지</h2>
        <div className="flex items-center justify-center h-32 text-gray-400">
          불러오는 중...
        </div>
      </aside>
    );
  }

  if (error && list.length === 0) {
    return (
      <aside className="w-[420px] border-r border-gray-200 h-screen overflow-y-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">메시지</h2>
        <div className="flex flex-col items-center justify-center h-32 text-gray-400">
          <p>{error}</p>
          <button
            onClick={() => fetchConversations()}
            className="mt-2 text-sm text-rose-500 hover:underline"
          >
            다시 시도
          </button>
        </div>
      </aside>
    );
  }

  if (list.length === 0) {
    return (
      <aside className="w-[420px] border-r border-gray-200 h-screen overflow-y-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">메시지</h2>
        <div className="flex items-center justify-center h-32 text-gray-400">
          대화가 없습니다
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-[420px] border-r border-gray-200 h-screen overflow-y-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">메시지</h2>

      <div className="space-y-4">
        {list.map((msg) => (
          <Link href={`/messages/${msg.id}`} key={msg.id}>
            <div className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition">
              <Image
                src={msg.image}
                alt={msg.user}
                width={50}
                height={50}
                className="rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `/images/default_avatar.png`;
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{msg.user}</p>
                <p className="text-gray-500 text-sm truncate">{msg.preview}</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {msg.date}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
