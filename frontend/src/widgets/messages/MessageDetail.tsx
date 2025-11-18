"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMessagesStore } from "@/entities/message/model/useMessagesStore";

interface Conversation {
  title: string;
  date: string;
  messages: {
    sender: string;
    text: string;
    avatar: string;
  }[];
}

interface Props {
  conversation: Conversation;
}

export default function MessageDetail({ conversation }: Props) {
  const router = useRouter();
  const msg = conversation.messages[0];

  return (
    <div className="w-full flex flex-col items-start">

      <p className="text-gray-400 text-sm mb-4">
        {msg.sender} 오후 8:53
      </p>

      <div className="flex items-start gap-3 mb-10">
        <div className="bg-gray-100 rounded-3xl px-6 py-4 text-gray-800 leading-relaxed max-w-[600px] shadow-sm">
          {msg.text}
        </div>
      </div>

      <div className="flex items-start gap-3">

        {/* 버튼 박스 */}
        <div className="border border-gray-200 bg-white rounded-2xl shadow-sm w-[420px] divide-y divide-gray-200">

          <button className="w-full py-4 px-6 flex justify-between items-center hover:bg-gray-50 transition">
            <span>Anna 님에게 메시지 보내기</span>
            <span className="text-gray-400 text-lg">›</span>
          </button>

          <button
            onClick={() => {
              const id = useMessagesStore.getState().addSupportMessage();
              router.push(`/messages/${id}`);
            }}
            className="w-full py-4 px-6 flex justify-between items-center hover:bg-gray-50 transition"
          >
            <span>에어비앤비에 도움 요청</span>
            <span className="text-gray-400 text-lg">›</span>
          </button>

        </div>
      </div>
    </div>
  );
}
