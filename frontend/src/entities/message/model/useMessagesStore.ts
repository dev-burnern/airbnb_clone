import { create } from "zustand";

export interface Message {
  sender: string;
  text: string;
  avatar: string;
}

export interface Conversation {
  id: number;
  title: string;
  date: string;
  messages: Message[];
}

export interface MessagesState {
  list: {
    id: number;
    user: string;
    preview: string;
    date: string;
    image: string;
  }[];

  conversations: Conversation[];

  addSupportMessage: () => number;
  addMessage: (conversationId: number, text: string) => void;
}

export const useMessagesStore = create<MessagesState>((set: any, get: any) => ({
  list: [
    {
      id: 1,
      user: "지원",
      preview: "번호로 메시지 주시면 유선 안내드리겠습니다.",
      date: "2024년 6월 14일",
      image: "/images/profile1.jpg",
    },
    {
      id: 2,
      user: "Anna, 호스트",
      preview: "에어비앤비 업데이트: 알림 - 후기글 작성",
      date: "2023년 1월 5일",
      image: "/images/profile2.jpg",
    },
  ],

  conversations: [],

  addSupportMessage: () => {
  const state = get();

  // 이미 존재하는 고객지원 대화가 있는지 확인
  const existing = state.conversations.find(
    (conv: Conversation) => conv.title === "에어비앤비 고객지원 팀"
  );

  if (existing) {
    return existing.id; // 새로 생성하지 않고 기존 id만 반환
  }

  // 새 대화 생성
  const id = Date.now();

  const newListItem = {
    id,
    user: "에어비앤비 고객지원 팀",
    preview: "상담을 도와드릴게요",
    date: "오늘",
    image: "/images/airbnb_logo.png",
  };

  const newConv: Conversation = {
    id,
    title: "에어비앤비 고객지원 팀",
    date: "오늘",
    messages: [
      {
        sender: "에어비앤비 고객지원 팀",
        text:
          "민서 님, 안녕하세요. 최선을 다해 도와드리겠습니다. 먼저 몇 가지 질문을 드린 다음 상담원과 연결해 드리겠습니다.",
          
        avatar: "/images/airbnb_logo.png",
      },
    ],
  };

  set({
    list: [...state.list, newListItem],
    conversations: [...state.conversations, newConv],
  });

  return id;
},


  
  addMessage: (conversationId: number, text: string) => {
    const state = get();

    const updatedConversations = state.conversations.map((conv: Conversation) => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            {
              sender: "나",
              text,
              avatar: "/images/profile_me.png",
            },
          ],
        };
      }
      return conv;
    });

    set({ conversations: updatedConversations });
  },
}));
