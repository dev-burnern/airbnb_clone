"use client";

import MessageItem from "./MessageItem";

const messages = [
  {
    id: 1,
    user: "지원",
    preview: "번호로 메시지 주시면 유선 안내드리겠습니다.",
    date: "2024년 6월 14일",
    image: "/images/profile1.jpg",
  },
  {
    id: 2,
    user: "Anna, 호스트",
    preview: "에어비앤비 업데이트: 알림 - 후기글 작성",
    date: "2023년 1월 5일",
    image: "/images/profile2.jpg",
  },
  {
    id: 3,
    user: "에어비앤비 고객지원 팀",
    preview: "Anna님에게 메시지 보내기 환영합니다.",
    date: "2023년 1월 4일",
    image: "/images/profile3.jpg",
  },
];

export default function MessageList() {
  return (
    <aside className="w-[500px] border-r border-gray-200 h-screen overflow-y-auto p-4">
      <h2 className="text-lg font-semibold mb-4">메시지</h2>

      <div className="space-y-3">
        {messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} />
        ))}
      </div>
    </aside>
  );
}