/**
 * Chat API 서비스
 * 백엔드 /chat 엔드포인트와 통신
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/backend/api/v1';

// 타입 정의
export interface User {
    id: string;
    name: string;
    email?: string;
    avatarUrl?: string;
}

export interface Message {
    id: string;
    conversationId: string;
    content: string;
    isRead: boolean;
    createdAt: string;
    sender: User;
}

export interface Conversation {
    id: string;
    title: string | null;
    participant1: User;
    participant2: User;
    messages?: Message[];
    lastMessageAt: string | null;
    createdAt: string;
}

// API 헬퍼
const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('accessToken');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: '요청 실패' }));
        throw new Error(error.message || '요청에 실패했습니다.');
    }
    const json = await response.json();
    // TransformInterceptor가 { success: true, data: T } 형태로 래핑
    return json.data !== undefined ? json.data : json;
};

// Chat API
export const chatApi = {
    /**
     * 내 대화방 목록 조회
     */
    async getConversations(): Promise<Conversation[]> {
        const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
            headers: getAuthHeaders(),
        });
        return handleResponse<Conversation[]>(response);
    },

    /**
     * 대화방 상세 조회 (메시지 포함)
     */
    async getConversation(id: string): Promise<Conversation> {
        const response = await fetch(`${API_BASE_URL}/chat/conversations/${id}`, {
            headers: getAuthHeaders(),
        });
        return handleResponse<Conversation>(response);
    },

    /**
     * 새 대화방 생성
     */
    async createConversation(participantId: string, title?: string): Promise<Conversation> {
        const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ participantId, title }),
        });
        return handleResponse<Conversation>(response);
    },

    /**
     * 메시지 전송
     */
    async sendMessage(conversationId: string, content: string): Promise<Message> {
        const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}/messages`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ content }),
        });
        return handleResponse<Message>(response);
    },

    /**
     * 메시지 읽음 처리
     */
    async markAsRead(conversationId: string): Promise<{ success: boolean }> {
        const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}/read`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        return handleResponse<{ success: boolean }>(response);
    },
};

export default chatApi;
