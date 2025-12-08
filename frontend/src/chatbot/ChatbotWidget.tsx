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
        <div className="fixed bottom-28 right-8 w-[420px] h-[580px] bg-white shadow-2xl rounded-2xl flex flex-col z-40 overflow-hidden border border-gray-200 animate-slideUp">
          
          {/* 헤더 */}
          <div className={`${AIRBNB_RED} text-white px-6 py-4 flex items-center justify-between`}>
            <div>
              <h3 className="font-bold text-lg">에어비앤비 챗봇</h3>
              <p className="text-xs text-white/80">숙소 추천 도우미</p>
            </div>
            <button 
              onClick={() => setOpened(false)}
              className="text-white/80 hover:text-white text-2xl leading-none"
            >
              ✕
            </button>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
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

          {/* 입력 영역 */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex gap-3 items-end">
              <textarea
                className={`flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 ${AIRBNB_RING} ${AIRBNB_BORDER} transition-all text-sm resize-none focus:outline-none`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !isLoading) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={isLoading ? "답변 생성 중..." : "메시지를 입력하세요..."}
                disabled={isLoading}
                rows={1}
                style={{ minHeight: "44px", maxHeight: "120px" }}
              />
              <button
                className={`${AIRBNB_RED} text-white px-6 py-3 rounded-xl ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : AIRBNB_HOVER
                } transition-all text-sm font-semibold shadow-md hover:shadow-lg disabled:hover:shadow-md`}
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? "..." : "전송"}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              AI가 생성한 답변은 부정확할 수 있습니다
            </p>
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