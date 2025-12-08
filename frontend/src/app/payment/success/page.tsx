'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState('');

  const listingId = searchParams.get('listingId');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests');
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    // 가상 결제: paymentKey 없이도 성공 처리
    if (!paymentKey && orderId && amount) {
      setIsProcessing(false);
      return;
    }

    // 실제 결제(토스 등)만 아래 로직 실행
    const processPayment = async () => {
      try {
        const token = localStorage.getItem('accessToken');
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

        const confirmData = await confirmResponse.json();
        if (!confirmData.success && !confirmResponse.ok) {
          throw new Error('결제 승인에 실패했습니다.');
        }

        // 2. 백엔드에 예약 생성 요청
        const bookingResponse = await fetch('http://localhost:3001/bookings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            listingId,
            checkIn: checkIn,
            checkOut: checkOut,
            guestCount: Number(guests),
            totalPrice: Number(amount),
            paymentKey,
            orderId,
            status: 'confirmed',
          }),
        });

        const bookingData = await bookingResponse.json();
        if (!bookingData.success) {
          throw new Error('예약 생성에 실패했습니다.');
        }

        // 3. 호스트와 채팅 생성 (선택사항)
        try {
          const listing = await fetch(`http://localhost:3001/listings/${listingId}`).then(r => r.json());
          if (listing.success && listing.data.host?.id) {
            const chatResponse = await fetch('http://localhost:3001/chat/conversations', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: listing.data.host.id,
              }),
            });

            const chatData = await chatResponse.json();
            if (chatData.success) {
              // 예약 완료 메시지 전송
              await fetch('http://localhost:3001/chat/messages', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  conversationId: chatData.data.id,
                  content: `[예약 완료]\n숙소: ${listing.data.title}\n체크인: ${checkIn}\n체크아웃: ${checkOut}\n게스트: ${guests}명\n결제 금액: ₩${Number(amount).toLocaleString()}\n\n예약이 확정되었습니다.`,
                }),
              });
            }
          }
        } catch (chatError) {
          console.error('채팅 생성 오류:', chatError);
          // 채팅 생성 실패해도 예약은 완료됨
        }

        setIsProcessing(false);
      } catch (error: any) {
        console.error('결제 처리 오류:', error);
        setError(error.message || '결제 처리 중 오류가 발생했습니다.');
        setIsProcessing(false);
      }
    };

    if (paymentKey && orderId && amount) {
      processPayment();
    } else if (!orderId || !amount) {
      setError('잘못된 접근입니다.');
      setIsProcessing(false);
    }
  }, [paymentKey, orderId, amount, listingId, checkIn, checkOut, guests]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">결제 처리 중...</h2>
          <p className="text-gray-600">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">결제 처리 실패</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/reservations')}
            className="w-full py-3 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition"
          >
            내 예약 확인하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">결제 완료!</h2>
        <p className="text-gray-600 mb-6">예약이 성공적으로 완료되었습니다.</p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">예약 정보</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">체크인</span>
              <span className="font-medium">{checkIn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">체크아웃</span>
              <span className="font-medium">{checkOut}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">게스트</span>
              <span className="font-medium">{guests}명</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold">결제 금액</span>
              <span className="font-bold text-rose-600">₩{Number(amount).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/bookings')}
            className="w-full py-3 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition"
          >
            내 예약 확인하기
          </button>
          <button
            onClick={() => router.push('/messages')}
            className="w-full py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            호스트에게 메시지 보내기
          </button>
        </div>
      </div>
    </div>
  );
}
