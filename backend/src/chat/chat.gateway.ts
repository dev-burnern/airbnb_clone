import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private connectedUsers: Map<string, string> = new Map(); // socketId -> userId

    constructor(private chatService: ChatService) { }

    handleConnection(client: Socket) {
        console.log(`클라이언트 연결됨: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`클라이언트 연결 해제: ${client.id}`);
        this.connectedUsers.delete(client.id);
    }

    @SubscribeMessage('authenticate')
    handleAuthenticate(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { userId: string },
    ) {
        this.connectedUsers.set(client.id, data.userId);
        console.log(`사용자 인증됨: ${data.userId}`);
        return { event: 'authenticated', data: { success: true } };
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { conversationId: string },
    ) {
        client.join(data.conversationId);
        console.log(`사용자가 대화방 입장: ${data.conversationId}`);
        return { event: 'joinedRoom', data: { conversationId: data.conversationId } };
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { conversationId: string },
    ) {
        client.leave(data.conversationId);
        console.log(`사용자가 대화방 퇴장: ${data.conversationId}`);
        return { event: 'leftRoom', data: { conversationId: data.conversationId } };
    }

    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { conversationId: string; content: string; senderId: string; senderName: string; senderAvatar?: string },
    ) {
        // 메시지를 대화방의 모든 클라이언트에게 브로드캐스트
        const messageData = {
            conversationId: data.conversationId,
            content: data.content,
            sender: {
                id: data.senderId,
                name: data.senderName,
                avatar: data.senderAvatar || '/images/default_avatar.png',
            },
            createdAt: new Date().toISOString(),
        };

        this.server.to(data.conversationId).emit('newMessage', messageData);
        console.log(`메시지 전송됨: ${data.conversationId}`);

        return { event: 'messageSent', data: messageData };
    }

    @SubscribeMessage('typing')
    handleTyping(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { conversationId: string; userName: string },
    ) {
        client.to(data.conversationId).emit('userTyping', {
            userName: data.userName,
        });
    }

    @SubscribeMessage('stopTyping')
    handleStopTyping(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { conversationId: string },
    ) {
        client.to(data.conversationId).emit('userStoppedTyping');
    }
}
