"use client";

import Image from "next/image";
import { Message } from "@/entities/message/model/useMessagesStore";

interface Props {
  messages: Message[];
  currentUserId?: string;
}

export default function MessageDetail({ messages, currentUserId }: Props) {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-400">
        메시지가 없습니다. 대화를 시작하세요!
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {messages.map((msg) => {
        const isMe = currentUserId === msg.senderId;

        return (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${isMe ? "flex-row-reverse" : ""}`}
          >
            {/* 아바타 */}
            {!isMe && (
              <Image
                src={msg.avatar}
                alt={msg.sender}
                width={40}
                height={40}
                className="rounded-full object-cover flex-shrink-0"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/default_avatar.png";
                }}
              />
            )}

            {/* 메시지 내용 */}
            <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              {!isMe && (
                <span className="text-xs text-gray-400 mb-1">{msg.sender}</span>
              )}
              <div
                className={`rounded-3xl px-4 py-3 max-w-[400px] shadow-sm ${isMe
                  ? "bg-rose-500 text-white rounded-tr-sm"
                  : "bg-gray-100 text-gray-800 rounded-tl-sm"
                  }`}
              >
                {msg.text}
              </div>
              <span className="text-xs text-gray-400 mt-1">
                {formatTime(msg.createdAt)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);

  // 한국 시간대로 명시적 변환
  return date.toLocaleTimeString('ko-KR', {
    timeZone: 'Asia/Seoul',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
