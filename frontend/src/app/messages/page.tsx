"use client";

import MessageList from "@/widgets/messages/MessageList";
import MessageDetail from "@/widgets/messages/MessageDetail";

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

export default function MessageDetailPage() {
  return (
    <main className="h-screen flex bg-white">

      {/* 왼쪽 메시지 리스트 */}
      <MessageList />

      {/* 오른쪽 전체 영역 */}
      <div className="flex-1 flex flex-col border-l border-gray-200">

        {/* 제목 */}
        <div className="px-40 pt-16">
          <h1 className="text-2xl font-semibold text-gray-900 text-left">
            {sampleConversation.title}
          </h1>
        </div>

        {/* 구분선 */}
        <div className="px-40 mt-4">
          <hr className="border-gray-200" />
        </div>

        {/* 날짜 (중앙 정렬!) */}
        <div className="w-full flex justify-center mt-4 mb-1">
          <span className="text-sm text-gray-500">
            {sampleConversation.date}
          </span>
        </div>



        {/* 실제 메시지 */}
        <div className="flex-1 px-40 pb-20 flex flex-col items-start overflow-y-auto">
          <MessageDetail conversation={sampleConversation} />
        </div>

      </div>
    </main>
  );
}
