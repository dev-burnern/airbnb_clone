'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState('');
    const hasProcessed = useRef(false); // 중복 호출 방지

    const listingId = searchParams.get('listingId');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    // 예약 생성 및 호스트 채팅 생성 함수
    const createBookingAndChat = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('로그인이 필요합니다.');
                setIsProcessing(false);
                return;
            }

            // 1. 예약 생성
            const bookingResponse = await fetch('http://localhost:3001/api/v1/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    listingId,
                    checkIn,
                    checkOut,
                    guestCount: parseInt(guests || '1', 10),
                }),
            });

            if (!bookingResponse.ok) {
                const errorData = await bookingResponse.json().catch(() => ({}));
                throw new Error(errorData.message || '예약 생성에 실패했습니다.');
            }

            const bookingResult = await bookingResponse.json();
            const bookingData = bookingResult.data || bookingResult;
            console.log('예약 생성 성공:', bookingData);

            // 2. 리스팅 정보 조회 (호스트 ID 가져오기)
            const listingResponse = await fetch(`http://localhost:3001/api/v1/listings/${listingId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (listingResponse.ok) {
                const listingResult = await listingResponse.json();
                const listingData = listingResult.data || listingResult;
                const hostId = listingData.host?.id;

                if (hostId) {
                    // 3. 호스트와 대화방 생성
                    const chatResponse = await fetch('http://localhost:3001/api/v1/chat/conversations', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            participantId: hostId,
                            title: `${listingData.title} 예약 문의`,
                        }),
                    });

                    if (chatResponse.ok) {
                        const chatResult = await chatResponse.json();
                        const chatData = chatResult.data || chatResult;
                        console.log('대화방 생성/조회 성공:', chatData);

                        // 4. 자동 인사 메시지 전송
                        await fetch(`http://localhost:3001/api/v1/chat/conversations/${chatData.id}/messages`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                content: '안녕하세요',
                            }),
                        });
                    }
                }
            }

            setIsProcessing(false);
            // 잠시 후 예약 목록으로 이동
            setTimeout(() => {
                router.push('/bookings');
            }, 2000);
        } catch (error: any) {
            console.error('예약 처리 오류:', error);
            setError(error.message || '예약 처리 중 오류가 발생했습니다.');
            setIsProcessing(false);
        }
    }, [listingId, checkIn, checkOut, guests, router]);

    useEffect(() => {
        // 중복 호출 방지 (React StrictMode에서 useEffect가 두 번 실행됨)
        if (hasProcessed.current) {
            return;
        }

        // 필수 파라미터 확인
        if (!orderId || !amount || !listingId) {
            setError('잘못된 접근입니다.');
            setIsProcessing(false);
            return;
        }

        hasProcessed.current = true; // 처리 시작 표시

        // 가상 결제 또는 실제 결제 모두 예약 생성 실행
        if (!paymentKey) {
            // 가상 결제: 바로 예약 생성
            createBookingAndChat();
        } else {
            // 실제 결제(토스 등): 결제 승인 후 예약 생성
            const processPayment = async () => {
                try {
                    // 1. 백엔드를 통해 결제 승인 (백엔드에서 토스 API 호출)
                    const confirmResponse = await fetch('http://localhost:3001/api/v1/payments/toss/verify', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            paymentKey,
                            orderId,
                            amount: Number(amount),
                        }),
                    });

                    if (!confirmResponse.ok) {
                        const errorData = await confirmResponse.json();
                        throw new Error(errorData.message || '결제 승인에 실패했습니다.');
                    }

                    // 결제 성공 후 예약 생성
                    await createBookingAndChat();
                } catch (error: any) {
                    console.error('결제 처리 오류:', error);
                    setError(error.message || '결제 처리 중 오류가 발생했습니다.');
                    setIsProcessing(false);
                }
            };

            processPayment();
        }
    }, [orderId, amount, listingId, paymentKey, createBookingAndChat]);

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h1 className="text-2xl font-bold mb-2">오류가 발생했습니다</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700"
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    if (isProcessing) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto mb-4"></div>
                    <h1 className="text-2xl font-bold mb-2">예약을 처리하고 있습니다...</h1>
                    <p className="text-gray-600">잠시만 기다려주세요.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="text-center">
                <div className="text-6xl mb-4">✅</div>
                <h1 className="text-2xl font-bold mb-2">예약이 완료되었습니다!</h1>
                <p className="text-gray-600 mb-6">예약 내역 페이지로 이동합니다...</p>
            </div>
        </div>
    );
}
