// ChatWidget.tsx (Radical Red Arbitrary Value 적용 수정됨)

"use client";

import { useState } from "react";

type Msg = {
  role: "user" | "assistant" | "system";
  content: string;
};

// 에어비앤비 공식 색상 Radical Red (#FF385C)
const AIRBNB_RED = "bg-[#FF385C]"; 
// 호버 및 강조를 위한 약간 어두운 색상 (#E03050)
const AIRBNB_HOVER = "hover:bg-[#E03050]";
// 인풋 포커스 링 색상
const AIRBNB_RING = "focus:ring-[#FF385C]";
const AIRBNB_BORDER = "focus:border-[#FF385C]";

export default function ChatWidget() {
  const [opened, setOpened] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "무엇을 도와드릴까요?" }
  ]);

  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Msg[] = [
      ...messages,
      { role: "user", content: input }
    ];
    setMessages(newMessages);
    setInput("");

    // 로딩 상태 표시
    const loadingMsg: Msg = { role: "assistant", content: "..." };
    setMessages([...newMessages, loadingMsg]);
    
    try {
      const res = await fetch("http://localhost:3001/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: newMessages.map((m) => ({
          role: m.role,
          content: m.content
          }))
        })

      });

      const data = await res.json();
      const reply = data?.answer || "답변을 가져올 수 없습니다.";

      const botMsg: Msg = {
        role: "assistant",
        content: reply
      };
      
      // 로딩 메시지를 실제 답변으로 대체
      setMessages((prevMessages) => {
        const updated = prevMessages.slice(0, -1); // 로딩 메시지 제거
        return [...updated, botMsg]; // 실제 답변 추가
      });

    } catch (error) {
       // 에러 처리 및 로딩 메시지 제거
       setMessages((prevMessages) => prevMessages.slice(0, -1).concat([{ role: "assistant", content: "요청에 실패했습니다." }]));
    }
  };


  return (
    <>
      <button
        onClick={() => setOpened(!opened)}
        // Radical Red 버튼
        className={`fixed bottom-8 right-8 ${AIRBNB_RED} text-white w-14 h-14 rounded-full shadow-xl ${AIRBNB_HOVER} transition-colors text-lg font-bold z-50`}
      >
        챗봇
      </button>

      {opened && (
        <div 
          // 높이 h-[500px] 유지
          className="fixed bottom-24 right-8 w-80 h-[500px] bg-white shadow-2xl border border-gray-100 rounded-xl flex flex-col z-40 overflow-hidden"
        >
          <div className="p-3 overflow-y-auto flex-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-3 ${m.role === "user" ? "text-right" : "text-left"}`}
              >
                <span
                  className={`inline-block max-w-[80%] px-3 py-2 rounded-xl text-sm break-words shadow-sm ${
                    m.role === "user"
                      ? `${AIRBNB_RED} text-white rounded-tr-sm` // 사용자 메시지 Radical Red
                      : "bg-gray-100 text-gray-800 rounded-tl-sm" // 챗봇 메시지 회색
                  }`}
                >
                  {m.content}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t p-3 flex gap-2 bg-gray-50">
            <input
              className={`flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 ${AIRBNB_RING} ${AIRBNB_BORDER} transition-colors text-sm`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="메시지를 입력하세요..."
            />
            <button
              className={`${AIRBNB_RED} text-white px-3 rounded-lg ${AIRBNB_HOVER} transition-colors text-sm font-medium`}
              onClick={sendMessage}
            >
              전송
            </button>
          </div>
        </div>
      )}
    </>
  );
}