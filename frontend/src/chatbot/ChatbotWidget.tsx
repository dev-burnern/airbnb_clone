// ChatWidget.tsx (타임아웃 해결)

"use client";

import { useState } from "react";

type Msg = {
  role: "user" | "assistant" | "system";
  content: string;
};

// 에어비앤비 공식 색상 Radical Red (#FF385C)
const AIRBNB_RED = "bg-[#FF385C]"; 
const AIRBNB_HOVER = "hover:bg-[#E03050]";
const AIRBNB_RING = "focus:ring-[#FF385C]";
const AIRBNB_BORDER = "focus:border-[#FF385C]";

export default function ChatWidget() {
  const [opened, setOpened] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "무엇을 도와드릴까요?" }
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const newMessages: Msg[] = [
      ...messages,
      { role: "user", content: input }
    ];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // 로딩 상태 표시
    const loadingMsg: Msg = { role: "assistant", content: "답변을 생성하고 있습니다... (최대 1분 소요)" };
    setMessages([...newMessages, loadingMsg]);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2분 타임아웃

      const res = await fetch("http://localhost:3001/api/v1/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal, // 타임아웃 시그널 추가
        body: JSON.stringify({
          message: input,
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
      console.log('✅ 응답 받음:', data); // 디버깅용

      // 다양한 응답 구조 대응
      let reply = "답변을 가져올 수 없습니다.";
      
      if (data?.answer) {
        // 직접 answer 필드가 있는 경우: { answer: "..." }
        reply = data.answer;
      } else if (data?.data?.answer) {
        // data 안에 answer가 있는 경우: { data: { answer: "..." } }
        reply = data.data.answer;
      } else if (typeof data === 'string') {
        // 응답이 문자열인 경우
        reply = data;
      }

      console.log('📝 파싱된 답변:', reply);

      const botMsg: Msg = {
        role: "assistant",
        content: reply
      };
      
      // 로딩 메시지를 실제 답변으로 대체
      setMessages((prevMessages) => {
        const updated = prevMessages.slice(0, -1); // 로딩 메시지 제거
        return [...updated, botMsg]; // 실제 답변 추가
      });

    } catch (error: any) {
      console.error('❌ 에러 발생:', error);
      
      let errorMessage = "요청에 실패했습니다.";
      
      if (error.name === 'AbortError') {
        errorMessage = "응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.";
      } else if (error.message) {
        errorMessage = `오류: ${error.message}`;
      }
      
      // 에러 처리 및 로딩 메시지 제거
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
      <button
        onClick={() => setOpened(!opened)}
        className={`fixed bottom-8 right-8 ${AIRBNB_RED} text-white w-14 h-14 rounded-full shadow-xl ${AIRBNB_HOVER} transition-colors text-lg font-bold z-50`}
      >
        챗봇
      </button>

      {opened && (
        <div 
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
                      ? `${AIRBNB_RED} text-white rounded-tr-sm`
                      : "bg-gray-100 text-gray-800 rounded-tl-sm"
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
              onKeyDown={(e) => e.key === "Enter" && !isLoading && sendMessage()}
              placeholder={isLoading ? "답변 생성 중..." : "메시지를 입력하세요..."}
              disabled={isLoading}
            />
            <button
              className={`${AIRBNB_RED} text-white px-3 rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : AIRBNB_HOVER} transition-colors text-sm font-medium`}
              onClick={sendMessage}
              disabled={isLoading}
            >
              {isLoading ? "..." : "전송"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}