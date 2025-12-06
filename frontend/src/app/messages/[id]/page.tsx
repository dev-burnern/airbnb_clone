"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import MessageList from "@/widgets/messages/MessageList";
import MessageDetail from "@/widgets/messages/MessageDetail";
import MessageSideInfo from "@/widgets/messages/MessageSideInfo";
import SideHeader from "@/widgets/side_header/Header";
import { useMessagesStore, Message } from "@/entities/message/model/useMessagesStore";
import { useChatSocket, ChatMessage } from "@/hooks/useChatSocket";

// 현재 사용자 정보 가져오기
function useCurrentUser() {
  const [user, setUser] = useState<{ id: string; name: string; avatar: string } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({
        id: payload.sub || payload.id,
        name: payload.name || "사용자",
        avatar: payload.avatarUrl || "/images/default_avatar.png",
      });
    } catch (error) {
      console.error("사용자 정보 파싱 실패:", error);
    }
  }, []);

  return user;
}

export default function MessagePage() {
  const { id } = useParams() as { id: string };
  const currentUser = useCurrentUser();

  const {
    conversations,
    loading,
    error,
    fetchConversation,
    addMessage,
    sendMessage,
    setCurrentConversation,
    markAsRead,
  } = useMessagesStore();

  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // WebSocket 메시지 수신 핸들러
  const handleNewMessage = useCallback(
    (chatMessage: ChatMessage) => {
      if (chatMessage.conversationId === id) {
        const message: Message = {
          id: Date.now().toString(),
          sender: chatMessage.sender.name,
          senderId: chatMessage.sender.id,
          text: chatMessage.content,
          avatar: chatMessage.sender.avatar || "/images/default_avatar.png",
          createdAt: chatMessage.createdAt,
          isRead: false,
        };
        addMessage(id, message);
      }
    },
    [id, addMessage]
  );

  const handleUserTyping = useCallback((data: { userName: string }) => {
    setTypingUser(data.userName);

    // 3초 후 타이핑 표시 제거
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setTypingUser(null);
    }, 3000);
  }, []);

  const handleUserStoppedTyping = useCallback(() => {
    setTypingUser(null);
  }, []);

  // WebSocket 연결
  const { isConnected, joinRoom, leaveRoom, sendMessage: socketSendMessage, startTyping, stopTyping } =
    useChatSocket({
      userId: currentUser?.id,
      onNewMessage: handleNewMessage,
      onUserTyping: handleUserTyping,
      onUserStoppedTyping: handleUserStoppedTyping,
    });

  // 대화 로드 및 방 입장
  useEffect(() => {
    if (id) {
      setCurrentConversation(id);
      fetchConversation(id);
      markAsRead(id);
    }

    return () => {
      setCurrentConversation(null);
    };
  }, [id, fetchConversation, setCurrentConversation, markAsRead]);

  // WebSocket 방 입장/퇴장
  useEffect(() => {
    if (isConnected && id) {
      joinRoom(id);
    }

    return () => {
      if (id) {
        leaveRoom(id);
      }
    };
  }, [isConnected, id, joinRoom, leaveRoom]);

  // 메시지 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations.get(id)?.messages]);

  // 메시지 전송
  const handleSendMessage = async () => {
    if (!inputValue.trim() || sending) return;

    setSending(true);
    try {
      // REST API로 메시지 저장
      await sendMessage(id, inputValue.trim());

      // WebSocket으로 실시간 브로드캐스트
      if (currentUser) {
        socketSendMessage({
          conversationId: id,
          content: inputValue.trim(),
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
        });
      }

      setInputValue("");
      stopTyping(id);
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      alert("메시지 전송에 실패했습니다.");
    } finally {
      setSending(false);
    }
  };

  // 타이핑 알림
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    if (currentUser && e.target.value) {
      startTyping(id, currentUser.name);
    } else {
      stopTyping(id);
    }
  };

  // 엔터 키 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const conversation = conversations.get(id);

  if (loading && !conversation) {
    return (
      <>
        <SideHeader />
        <main className="h-screen flex bg-white">
          <MessageList />
          <div className="flex-1 flex items-center justify-center text-gray-400">
            대화를 불러오는 중...
          </div>
        </main>
      </>
    );
  }

  if (error && !conversation) {
    return (
      <>
        <SideHeader />
        <main className="h-screen flex bg-white">
          <MessageList />
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <p>{error}</p>
            <button
              onClick={() => fetchConversation(id)}
              className="mt-2 text-sm text-rose-500 hover:underline"
            >
              다시 시도
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SideHeader />
      <main className="h-screen flex bg-white">
        <MessageList />

        <div className="flex-1 flex flex-col border-l border-gray-200">
          {/* 헤더 */}
          <div className="px-8 py-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold">
              {conversation?.title || "대화"}
            </h1>
            {isConnected && (
              <span className="text-xs text-green-500">● 연결됨</span>
            )}
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto px-8 py-4">
            <MessageDetail
              messages={conversation?.messages || []}
              currentUserId={currentUser?.id}
            />

            {/* 타이핑 표시 */}
            {typingUser && (
              <div className="text-sm text-gray-400 mt-2">
                {typingUser}님이 입력 중...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 입력창 */}
          <div className="px-8 py-4 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-3">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="메시지를 입력하세요..."
                className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
                disabled={sending}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || sending}
                className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? "..." : "↑"}
              </button>
            </div>
          </div>
        </div>

        <MessageSideInfo user={conversation?.otherUser} />
      </main>
    </>
  );
}
