/**
 * Chat WebSocket 훅
 * Socket.io를 사용한 실시간 채팅 연결 관리
 */

'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export interface ChatMessage {
    conversationId: string;
    content: string;
    sender: {
        id: string;
        name: string;
        avatar?: string;
    };
    createdAt: string;
}

interface UseChatSocketOptions {
    userId?: string;
    onNewMessage?: (message: ChatMessage) => void;
    onUserTyping?: (data: { userName: string }) => void;
    onUserStoppedTyping?: () => void;
}

interface UseChatSocketReturn {
    isConnected: boolean;
    joinRoom: (conversationId: string) => void;
    leaveRoom: (conversationId: string) => void;
    sendMessage: (data: {
        conversationId: string;
        content: string;
        senderId: string;
        senderName: string;
        senderAvatar?: string;
    }) => void;
    startTyping: (conversationId: string, userName: string) => void;
    stopTyping: (conversationId: string) => void;
}

export function useChatSocket(options: UseChatSocketOptions): UseChatSocketReturn {
    const { userId, onNewMessage, onUserTyping, onUserStoppedTyping } = options;
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // 소켓 연결 초기화
    useEffect(() => {
        if (!userId) return;

        // Socket.io 연결 (namespace: /chat)
        const socket = io(`${SOCKET_URL}/chat`, {
            transports: ['websocket', 'polling'],
            autoConnect: true,
        });

        socketRef.current = socket;

        // 연결 이벤트
        socket.on('connect', () => {
            console.log('WebSocket 연결됨');
            setIsConnected(true);

            // 사용자 인증
            socket.emit('authenticate', { userId });
        });

        socket.on('disconnect', () => {
            console.log('WebSocket 연결 해제');
            setIsConnected(false);
        });

        socket.on('authenticated', (data: { success: boolean }) => {
            console.log('인증 완료:', data);
        });

        // 새 메시지 수신
        socket.on('newMessage', (message: ChatMessage) => {
            console.log('새 메시지 수신:', message);
            onNewMessage?.(message);
        });

        // 타이핑 알림
        socket.on('userTyping', (data: { userName: string }) => {
            onUserTyping?.(data);
        });

        socket.on('userStoppedTyping', () => {
            onUserStoppedTyping?.();
        });

        // 클린업
        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [userId, onNewMessage, onUserTyping, onUserStoppedTyping]);

    // 대화방 입장
    const joinRoom = useCallback((conversationId: string) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('joinRoom', { conversationId });
            console.log('대화방 입장:', conversationId);
        }
    }, []);

    // 대화방 퇴장
    const leaveRoom = useCallback((conversationId: string) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('leaveRoom', { conversationId });
            console.log('대화방 퇴장:', conversationId);
        }
    }, []);

    // 메시지 전송
    const sendMessage = useCallback((data: {
        conversationId: string;
        content: string;
        senderId: string;
        senderName: string;
        senderAvatar?: string;
    }) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('sendMessage', data);
            console.log('메시지 전송:', data);
        }
    }, []);

    // 타이핑 시작
    const startTyping = useCallback((conversationId: string, userName: string) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('typing', { conversationId, userName });
        }
    }, []);

    // 타이핑 중지
    const stopTyping = useCallback((conversationId: string) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('stopTyping', { conversationId });
        }
    }, []);

    return {
        isConnected,
        joinRoom,
        leaveRoom,
        sendMessage,
        startTyping,
        stopTyping,
    };
}

export default useChatSocket;
