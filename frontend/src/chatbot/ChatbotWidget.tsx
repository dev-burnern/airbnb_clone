"use client";

import { useState, useRef, useEffect } from "react";

type Msg = {
  role: "user" | "assistant" | "system";
  content: string;
};

const AIRBNB_RED = "bg-[#FF385C]";
const AIRBNB_HOVER = "hover:bg-[#E03050]";
const AIRBNB_RING = "focus:ring-[#FF385C]";
const AIRBNB_BORDER = "focus:border-[#FF385C]";

export default function ChatWidget() {
  const [opened, setOpened] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "안녕하세요! 에어비앤비 숙소 추천 챗봇입니다. 어떤 도움이 필요하신가요? 😊" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    const newMessages: Msg[] = [
      ...messages,
      { role: "user", content: userMessage }
    ];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const loadingMsg: Msg = { 
      role: "assistant", 
      content: "답변을 생성하고 있습니다... 💭" 
    };
    setMessages([...newMessages, loadingMsg]);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const res = await fetch("http://localhost:3001/api/v1/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: userMessage,
          history: newMessages.map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`서버 오류: ${res.status}`);
      }

      const data = await res.json();
      let reply = "답변을 가져올 수 없습니다.";
      
      if (data?.answer) {
        reply = data.answer;
      } else if (data?.data?.answer) {
        reply = data.data.answer;
      } else if (typeof data === 'string') {
        reply = data;
      }

      const botMsg: Msg = {
        role: "assistant",
        content: reply
      };
      
      setMessages((prevMessages) => {
        const updated = prevMessages.slice(0, -1);
        return [...updated, botMsg];
      });

    } catch (error: any) {
      console.error('❌ 에러 발생:', error);
      
      let errorMessage = "요청에 실패했습니다. 다시 시도해주세요.";
      
      if (error.name === 'AbortError') {
        errorMessage = "응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.";
      }
      
      setMessages((prevMessages) => 
        prevMessages.slice(0, -1).concat([
          { role: "assistant", content: errorMessage }
        ])
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 챗봇 버튼 */}
      <button
        onClick={() => setOpened(!opened)}
        className={`fixed bottom-8 right-8 ${AIRBNB_RED} text-white w-16 h-16 rounded-full shadow-2xl ${AIRBNB_HOVER} transition-all duration-300 text-xl font-bold z-50 flex items-center justify-center hover:scale-110`}
        aria-label="챗봇 열기"
      >
        {opened ? "✕" : "💬"}
      </button>

      {/* 챗봇 창 */}
      {opened && (
        <div 
          // 높이 h-[500px] 유지
          className="fixed bottom-24 right-8 w-80 h-[500px] bg-white shadow-2xl border border-gray-100 rounded-xl flex flex-col z-40 overflow-hidden"
        >
          <div className="p-3 overflow-y-auto flex-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  {/* 아바타 */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    m.role === "user" ? AIRBNB_RED : "bg-gray-300"
                  } text-white text-sm font-bold`}>
                    {m.role === "user" ? "👤" : "🤖"}
                  </div>
                  
                  {/* 메시지 버블 */}
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${
                      m.role === "user"
                        ? `${AIRBNB_RED} text-white rounded-tr-sm`
                        : "bg-white text-gray-800 rounded-tl-sm border border-gray-200"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
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

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}