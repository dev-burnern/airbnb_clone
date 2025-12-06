"use client";

import { useState } from "react";
import { Search, Send } from "lucide-react";
import KeyInfoAlert from "@/components/host/KeyInfoAlert";

export default function HostMessagesPage() {
  const [selectedGuest, setSelectedGuest] = useState(0);
  const [message, setMessage] = useState("");

  // 더미 데이터
  const guests = [
    {
      id: 1,
      name: "김민수",
      avatar: "👤",
      lastMessage: "안녕하세요, 체크인 시간이 몇 시인가요?",
      date: "12월 15일 - 12월 17일",
      unread: true,
    },
    {
      id: 2,
      name: "이지은",
      avatar: "👤",
      lastMessage: "감사합니다!",
      date: "12월 20일 - 12월 23일",
      unread: false,
    },
  ];

  const currentChat = [
    { sender: "guest", text: "안녕하세요, 체크인 시간이 몇 시인가요?", time: "오후 3:20" },
    { sender: "host", text: "안녕하세요! 체크인은 오후 3시부터 가능합니다.", time: "오후 3:25" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <KeyInfoAlert />

        <h1 className="text-3xl font-semibold mb-6">메시지</h1>

        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-250px)]">
          {/* Left - Message List */}
          <div className="col-span-3 border-r border-gray-200 pr-4">
            <div className="mb-4">
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="메시지 검색"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
                />
              </div>
            </div>

            <div className="flex gap-4 mb-4 text-sm">
              <button className="font-semibold underline">전체</button>
              <button className="text-gray-600 hover:text-gray-900">읽지 않음</button>
            </div>

            <div className="space-y-2">
              {guests.map((guest, index) => (
                <button
                  key={guest.id}
                  onClick={() => setSelectedGuest(index)}
                  className={`w-full p-3 rounded-lg text-left transition ${
                    selectedGuest === index ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                      {guest.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{guest.name}</span>
                        {guest.unread && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{guest.date}</p>
                      <p className="text-sm text-gray-600 truncate">
                        {guest.lastMessage}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Center - Chat Window */}
          <div className="col-span-6 flex flex-col">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="font-semibold">{guests[selectedGuest].name}</h2>
              <p className="text-sm text-gray-600">{guests[selectedGuest].date}</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {currentChat.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "host" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-md px-4 py-2 rounded-2xl ${
                      msg.sender === "host"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === "host" ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="메시지를 작성하세요..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
                />
                <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Right - Reservation Info */}
          <div className="col-span-3 pl-4 border-l border-gray-200">
            <h3 className="font-semibold mb-4">예약 정보</h3>
            <div className="space-y-4">
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src="/images/placeholder-room.jpg"
                  alt="Property"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">바다가 보이는 아늑한 집</p>
                <p className="text-sm text-gray-600">
                  {guests[selectedGuest].date}
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-gray-700">
                  이 날짜에는 예약을 받을 수 없습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
