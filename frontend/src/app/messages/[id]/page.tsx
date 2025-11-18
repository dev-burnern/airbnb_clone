"use client";

import { useParams } from "next/navigation";
import { useMessagesStore } from "@/entities/message/model/useMessagesStore";
import MessageList from "@/widgets/messages/MessageList";
import MessageDetail from "@/widgets/messages/MessageDetail";
import MessageSideInfo from "@/widgets/messages/MessageSideInfo";

export default function MessagePage() {
  const { id } = useParams() as { id: string };

  const conversations = useMessagesStore((state) => state.conversations);

  const conversation = conversations.find(
    (conv) => conv.id === Number(id)
  );

  if (!conversation) {
    return (
      <main className="h-screen flex bg-white">
        <MessageList />
        <div className="flex-1 flex items-center justify-center text-gray-400">
          대화를 불러오는 중...
        </div>
        <MessageSideInfo />
      </main>
    );
  }

  return (
    <main className="h-screen flex bg-white">
      <MessageList />

      <div className="flex-1 flex flex-col border-l border-gray-200">
        
        {/* 제목 */}
        <div className="px-40 pt-12">
          <h1 className="text-3xl font-semibold">{conversation.title}</h1>
        </div>

        <div className="px-40 mt-4">
          <hr className="border-gray-200" />
        </div>

        {/* 날짜 */}
        <div className="w-full flex justify-center mt-4 mb-2">
          <span className="text-gray-500">{conversation.date}</span>
        </div>

        {/* 메시지 영역 */}
        <div className="px-10 flex-1 overflow-y-auto pb-6 max-h-[50vh]">
          <MessageDetail conversation={conversation} />
        </div>

      {/* 입력창 (Airbnb 스타일, 구분선 제거됨) */}
<div className="px-40 py-6 bg-white">
  <div className="w-full bg-white border border-gray-300 rounded-[32px] px-6 py-5 flex items-center gap-4 shadow-sm">

    {/* 사진 첨부 버튼 */}
    <button className="text-gray-500 hover:text-gray-700">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-7 h-7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 13.5l1.523-1.523a2.25 2.25 0 013.182 0L21.75 15.75"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 19.5h16.5a1.5 1.5 0 001.5-1.5V8.25a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 8.25v9.75a1.5 1.5 0 001.5 1.5z"
        />
      </svg>
    </button>

    {/* 텍스트 입력 */}
    <input
      type="text"
      placeholder="메시지를 작성하세요..."
      className="flex-1 text-lg placeholder-gray-400 outline-none"
    />

    {/* 전송 버튼 */}
    <button className="text-gray-400 hover:text-gray-600 text-2xl">↑</button>
  </div>
</div>

      
      </div>

      <MessageSideInfo />
    </main>
  );
}
