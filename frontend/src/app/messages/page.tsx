"use client";

import { useEffect } from "react";
import MessageList from "@/widgets/messages/MessageList";
import SideHeader from "@/widgets/side_header/Header";
import { useMessagesStore } from "@/entities/message/model/useMessagesStore";

export default function MessagesPage() {
  const { list, loading } = useMessagesStore();

  return (
    <>
      <SideHeader />
      <main className="h-screen flex bg-white">
        {/* 왼쪽 메시지 리스트 */}
        <MessageList />

        {/* 오른쪽 안내 영역 */}
        <div className="flex-1 flex flex-col items-center justify-center border-l border-gray-200">
          {loading ? (
            <div className="text-gray-400">불러오는 중...</div>
          ) : list.length === 0 ? (
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                메시지가 없습니다
              </h2>
              <p className="text-gray-500">
                호스트나 게스트에게 메시지를 보내보세요
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-4">👈</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                대화를 선택하세요
              </h2>
              <p className="text-gray-500">
                왼쪽 목록에서 대화를 선택하여 메시지를 확인하세요
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
