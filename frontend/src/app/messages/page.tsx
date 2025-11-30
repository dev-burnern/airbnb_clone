"use client";

import { Suspense } from "react";
import MessageList from "@/widgets/messages/MessageList";
import MessageDetail from "@/widgets/messages/MessageDetail";

export default function MessageDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MessagesContent />
    </Suspense>
  );
}

function MessagesContent() {
  const sampleConversation = {
    title: "에어비앤비 고객지원 팀",
    date: "2023년 1월 4일",
    messages: [
      {
        sender: "에어비앤비 고객지원 팀",
        text: "숙박 기간 동안 도움이 필요하면 호스트 Anna 님에게 연락하실 수 있지만, 에어비앤비의 도움이 필요하다면 언제든지 알려주세요. 연중무휴 지원을 제공해드립니다.",
        avatar: "/images/airbnb_logo.png",
      },
    ],
  };

  return (
    <main className="h-screen flex bg-white">

      <MessageList />

      <div className="flex-1 flex flex-col border-l border-gray-200">
        <div className="px-40 pt-16">
          <h1 className="text-2xl font-semibold text-gray-900 text-left">
            {sampleConversation.title}
          </h1>
        </div>

        <div className="px-40 mt-4">
          <hr className="border-gray-200" />
        </div>

        <div className="w-full flex justify-center mt-4 mb-1">
          <span className="text-sm text-gray-500">
            {sampleConversation.date}
          </span>
        </div>

        <div className="flex-1 px-40 pb-20 flex flex-col items-start overflow-y-auto">
          <MessageDetail conversation={sampleConversation} />
        </div>
      </div>

    </main>
  );
}
