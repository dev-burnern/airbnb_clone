"use client";

import Link from "next/link";
import Image from "next/image";
import { useMessagesStore } from "@/entities/message/model/useMessagesStore";
import type { MessagesState } from "@/entities/message/model/useMessagesStore";

export default function MessageList() {
  const list = useMessagesStore((state: MessagesState) => state.list);

  return (
    <aside className="w-[420px] border-r border-gray-200 h-screen overflow-y-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">메시지</h2>

      <div className="space-y-4">
        {list.map((msg: MessagesState["list"][0]) => (
          <Link href={`/messages/${msg.id}`} key={msg.id}>
            <div className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition">
              <Image
                src={msg.image}
                alt={msg.user}
                width={50}
                height={50}
                className="rounded-full"
              />
              <div className="flex-1">
                <p className="font-semibold">{msg.user}</p>
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
