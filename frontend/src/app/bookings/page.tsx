'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MessageCircle, MapPin } from 'lucide-react';

interface Booking {
    id: string;
    checkIn: string;
    checkOut: string;
    guestCount: number;
    status: string;
    totalPrice: number;
    createdAt: string;
    listing: {
        id: string;
        title: string;
        address: string;
        images: string[];
        host?: {
            id: string;
            name: string;
        };
    };
}

export default function BookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch('/backend/api/v1/bookings', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('예약 목록을 불러올 수 없습니다.');
                }

                const data = await response.json();
                // 배열인지 확인 (API가 객체를 반환할 수도 있음)
                setBookings(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Fetch bookings error:', err);
                setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [router]);

    // 호스트에게 메시지 보내기
    const handleMessageHost = async (booking: Booking) => {
        const token = localStorage.getItem('accessToken');
        if (!token || !booking.listing.host?.id) return;

        try {
            // 대화방 생성 또는 기존 대화방 찾기
            const response = await fetch('/backend/api/v1/chat/conversations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    participantId: booking.listing.host.id,
                    title: `${booking.listing.title} 예약 문의`,
                }),
            });

            if (response.ok) {
                const conversation = await response.json();
                router.push(`/messages/${conversation.id}`);
            } else {
                // 이미 대화방이 있을 수 있으므로 메시지 페이지로 이동
                router.push('/messages');
            }
        } catch (err) {
            console.error('Create conversation error:', err);
            router.push('/messages');
        }
    };

    // 상태에 따른 배지 색상
    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; color: string }> = {
            pending: { label: '대기중', color: 'bg-yellow-100 text-yellow-800' },
            confirmed: { label: '확정', color: 'bg-green-100 text-green-800' },
            cancelled: { label: '취소됨', color: 'bg-red-100 text-red-800' },
            completed: { label: '완료', color: 'bg-gray-100 text-gray-800' },
        };
        const config = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.label}
            </span>
        );
    };

    // 날짜 포맷
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-40 bg-gray-200 rounded"></div>
                    <div className="h-40 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">내 예약</h1>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    {error}
                </div>
            )}

            {bookings.length === 0 ? (
                <div className="text-center py-12">
                    <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-600 mb-2">아직 예약이 없습니다</h2>
                    <p className="text-gray-500 mb-6">멋진 숙소를 찾아 첫 예약을 해보세요!</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition"
                    >
                        숙소 둘러보기
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="border rounded-xl overflow-hidden hover:shadow-lg transition"
                        >
                            <div className="flex flex-col md:flex-row">
                                {/* 이미지 */}
                                <div className="relative w-full md:w-48 h-48 flex-shrink-0">
                                    <Image
                                        src={booking.listing.images?.[0] || 'https://placehold.co/400x300?text=No+Image'}
                                        alt={booking.listing.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* 정보 */}
                                <div className="flex-1 p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold">{booking.listing.title}</h3>
                                        {getStatusBadge(booking.status)}
                                    </div>

                                    <div className="flex items-center text-gray-500 text-sm mb-3">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {booking.listing.address}
                                    </div>

                                    <div className="text-sm text-gray-600 mb-4">
                                        <span className="font-medium">{formatDate(booking.checkIn)}</span>
                                        <span className="mx-2">→</span>
                                        <span className="font-medium">{formatDate(booking.checkOut)}</span>
                                        <span className="ml-3 text-gray-500">게스트 {booking.guestCount}명</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="font-bold text-lg">
                                            ₩{booking.totalPrice?.toLocaleString() || 0}
                                        </div>
                                        <button
                                            onClick={() => handleMessageHost(booking)}
                                            className="flex items-center gap-2 px-4 py-2 border border-gray-900 rounded-lg hover:bg-gray-50 transition"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            호스트에게 메시지
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
