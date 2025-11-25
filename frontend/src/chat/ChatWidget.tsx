"use client";

import { useState } from "react";

type Msg = {
  role: "user" | "assistant" | "system";
  content: string;
};

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

  const res = await fetch("http://localhost:3001/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: newMessages })
  });

  const data = await res.json();
  const reply = data?.message?.content || "답변을 가져올 수 없습니다.";

  const botMsg: Msg = {
    role: "assistant",
    content: reply
  };

  setMessages([...newMessages, botMsg]);
};


  return (
    <>
      <button
        onClick={() => setOpened(!opened)}
        className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg"
      >
        챗봇
      </button>

      {opened && (
        <div className="fixed bottom-20 right-5 w-80 h-96 bg-white shadow-lg border rounded-xl flex flex-col">
          <div className="flex-1 p-3 overflow-y-auto">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-2 ${m.role === "user" ? "text-right" : "text-left"}`}
              >
                <span
                  className={`inline-block px-3 py-2 rounded-lg ${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {m.content}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t p-2 flex gap-2">
            <input
              className="flex-1 border rounded px-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="bg-blue-600 text-white px-3 rounded"
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
