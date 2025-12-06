/**
 * Messages Store
 * 채팅 대화 및 메시지 상태 관리 (백엔드 API 연동)
 */

import { create } from "zustand";
import { chatApi, Conversation as ApiConversation, Message as ApiMessage } from "@/shared/api/chatApi";

// 프론트엔드 타입 정의
export interface Message {
  id: string;
  sender: string;
  senderId: string;
  text: string;
  avatar: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  date: string;
  lastMessage?: string;
  otherUser: {
    id: string;
    name: string;
    avatar: string;
  };
  messages: Message[];
}

export interface MessageListItem {
  id: string;
  user: string;
  preview: string;
  date: string;
  image: string;
}

export interface MessagesState {
  // 상태
  list: MessageListItem[];
  conversations: Map<string, Conversation>;
  currentConversationId: string | null;
  loading: boolean;
  error: string | null;

  // 액션
  fetchConversations: () => Promise<void>;
  fetchConversation: (id: string) => Promise<void>;
  setCurrentConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: Message) => void;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  createConversation: (participantId: string, title?: string) => Promise<string>;
  markAsRead: (conversationId: string) => Promise<void>;
}

// API 응답을 프론트엔드 타입으로 변환
const transformApiMessage = (msg: ApiMessage): Message => ({
  id: msg.id,
  sender: msg.sender?.name || "알 수 없음",
  senderId: msg.sender?.id || "",
  text: msg.content,
  avatar: msg.sender?.avatarUrl || "/images/default_avatar.png",
  createdAt: msg.createdAt,
  isRead: msg.isRead,
});

const transformApiConversation = (conv: ApiConversation, currentUserId?: string): Conversation => {
  // 상대방 찾기 (현재 사용자가 아닌 쪽)
  const otherUser = currentUserId === conv.participant1?.id ? conv.participant2 : conv.participant1;

  const messages = conv.messages?.map(transformApiMessage) || [];
  const lastMessage = messages[messages.length - 1];

  return {
    id: conv.id,
    title: conv.title || otherUser?.name || "대화",
    date: formatDate(conv.lastMessageAt || conv.createdAt),
    lastMessage: lastMessage?.text,
    otherUser: {
      id: otherUser?.id || "",
      name: otherUser?.name || "알 수 없음",
      avatar: otherUser?.avatarUrl || "/images/default_avatar.png",
    },
    messages,
  };
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "오늘";
  if (diffDays === 1) return "어제";
  if (diffDays < 7) return `${diffDays}일 전`;

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

// 현재 사용자 ID 가져오기
const getCurrentUserId = (): string | undefined => {
  if (typeof window === "undefined") return undefined;
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return undefined;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || payload.id;
  } catch {
    return undefined;
  }
};

export const useMessagesStore = create<MessagesState>((set, get) => ({
  // 초기 상태
  list: [],
  conversations: new Map(),
  currentConversationId: null,
  loading: false,
  error: null,

  // 대화 목록 조회
  fetchConversations: async () => {
    set({ loading: true, error: null });
    try {
      const apiConversations = await chatApi.getConversations();
      const currentUserId = getCurrentUserId();

      const conversations = new Map<string, Conversation>();
      const list: MessageListItem[] = [];

      for (const conv of apiConversations) {
        const transformed = transformApiConversation(conv, currentUserId);
        conversations.set(conv.id, transformed);

        list.push({
          id: conv.id,
          user: transformed.otherUser.name,
          preview: transformed.lastMessage || "대화를 시작하세요",
          date: transformed.date,
          image: transformed.otherUser.avatar,
        });
      }

      set({ list, conversations, loading: false });
    } catch (error) {
      console.error("대화 목록 조회 실패:", error);
      set({ error: "대화 목록을 불러오는 데 실패했습니다.", loading: false });
    }
  },

  // 대화 상세 조회
  fetchConversation: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const apiConversation = await chatApi.getConversation(id);
      const currentUserId = getCurrentUserId();
      const transformed = transformApiConversation(apiConversation, currentUserId);

      set((state) => {
        const newConversations = new Map(state.conversations);
        newConversations.set(id, transformed);
        return { conversations: newConversations, loading: false };
      });
    } catch (error) {
      console.error("대화 상세 조회 실패:", error);
      set({ error: "대화를 불러오는 데 실패했습니다.", loading: false });
    }
  },

  // 현재 대화 설정
  setCurrentConversation: (id: string | null) => {
    set({ currentConversationId: id });
  },

  // 메시지 추가 (WebSocket으로 수신된 메시지)
  addMessage: (conversationId: string, message: Message) => {
    set((state) => {
      const conversation = state.conversations.get(conversationId);
      if (!conversation) return state;

      const updatedConversation = {
        ...conversation,
        messages: [...conversation.messages, message],
        lastMessage: message.text,
        date: "방금",
      };

      const newConversations = new Map(state.conversations);
      newConversations.set(conversationId, updatedConversation);

      // 목록 업데이트
      const newList = state.list.map((item) =>
        item.id === conversationId
          ? { ...item, preview: message.text, date: "방금" }
          : item
      );

      return { conversations: newConversations, list: newList };
    });
  },

  // 메시지 전송
  sendMessage: async (conversationId: string, content: string) => {
    try {
      const apiMessage = await chatApi.sendMessage(conversationId, content);
      const message = transformApiMessage(apiMessage);
      get().addMessage(conversationId, message);
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      throw error;
    }
  },

  // 대화방 생성
  createConversation: async (participantId: string, title?: string): Promise<string> => {
    try {
      const apiConversation = await chatApi.createConversation(participantId, title);
      const currentUserId = getCurrentUserId();
      const transformed = transformApiConversation(apiConversation, currentUserId);

      set((state) => {
        const newConversations = new Map(state.conversations);
        newConversations.set(apiConversation.id, transformed);

        const newListItem: MessageListItem = {
          id: apiConversation.id,
          user: transformed.otherUser.name,
          preview: "대화를 시작하세요",
          date: "방금",
          image: transformed.otherUser.avatar,
        };

        return {
          conversations: newConversations,
          list: [newListItem, ...state.list],
        };
      });

      return apiConversation.id;
    } catch (error) {
      console.error("대화방 생성 실패:", error);
      throw error;
    }
  },

  // 읽음 처리
  markAsRead: async (conversationId: string) => {
    try {
      await chatApi.markAsRead(conversationId);

      set((state) => {
        const conversation = state.conversations.get(conversationId);
        if (!conversation) return state;

        const updatedMessages = conversation.messages.map((msg) => ({
          ...msg,
          isRead: true,
        }));

        const updatedConversation = {
          ...conversation,
          messages: updatedMessages,
        };

        const newConversations = new Map(state.conversations);
        newConversations.set(conversationId, updatedConversation);

        return { conversations: newConversations };
      });
    } catch (error) {
      console.error("읽음 처리 실패:", error);
    }
  },
}));
