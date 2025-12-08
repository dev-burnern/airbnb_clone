'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('가상결제');
  const [showDateEdit, setShowDateEdit] = useState(false);
  const [showGuestEdit, setShowGuestEdit] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  // URL에서 예약 정보 가져오기
  const listingId = searchParams.get('listingId');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [guests, setGuests] = useState(Number(searchParams.get('guests')) || 1);
  // 숙소 상세 정보 fetch
  const [listing, setListing] = useState<any>(null);
  const [listingLoading, setListingLoading] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);

  useEffect(() => {
    if (!listingId) return;
    setListingLoading(true);
    fetch(`http://localhost:3001/api/v1/listings/${listingId}`)
      .then(res => res.json())
      .then(json => setListing(json.success && json.data ? json.data : json))
      .catch(e => setListingError('숙소 정보를 불러올 수 없습니다.'))
      .finally(() => setListingLoading(false));
  }, [listingId]);

  const imageUrl = listing?.images?.[0] || 'https://placehold.co/600x400?text=No+Image';
  const listingTitle = listing?.title || '';
  const pricePerNight = listing?.basePrice || 0;
  const reviewCount = listing?.reviewCount || 0;
  const rating = listing?.rating || null;
  const hostName = listing?.host?.name || '';
  const refundPolicy = listing?.refundPolicy || '예약 취소 시 환불 정책이 적용됩니다.';

  useEffect(() => {
    if (!listing || !checkIn || !checkOut || !pricePerNight) return;
    const nights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
    );
    const cleaningFee = listing?.cleaningFee ?? 20000;
    const serviceFee = Math.round(pricePerNight * nights * 0.05);
    const extraGuestFee = listing?.extraGuestFee ? Math.max(0, guests - (listing?.baseGuests || 1)) * listing.extraGuestFee : 0;
    const newTotal = (pricePerNight * nights) + cleaningFee + serviceFee + extraGuestFee;
    setTotalPrice(newTotal);
  }, [listing, checkIn, checkOut, pricePerNight, guests]);

  const handleDateSave = () => setShowDateEdit(false);
  const handleGuestSave = () => setShowGuestEdit(false);

  const handlePayment = () => {
    const orderId = `FAKE_ORDER_${Date.now()}`;
    router.push(`/payment/success?listingId=${listingId}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&amount=${totalPrice}&orderId=${orderId}`);
  };

  if (listingLoading) return <div className="text-center py-20">숙소 정보를 불러오는 중...</div>;
  if (listingError || !listing) return <div className="text-center py-20 text-red-500">숙소 정보를 불러올 수 없습니다.</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="border-b">
          <div className="flex items-center gap-4 px-6 py-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold">확인 및 결제</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 py-8">
          {/* 왼쪽: 결제 수단 */}
          <div className="space-y-6">
            {/* 2. 예약 내용 확인 */}
            <div className="border rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">예약 내용 확인</h2>
              <p className="text-sm text-gray-600 mb-4">
                버튼을 선택하여 <span className="underline">예약 약관</span>에 동의하시기 바랍니다.
              </p>
              <button
                onClick={handlePayment}
                className="w-full py-4 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition"
              >
                가상 결제하기
              </button>
            </div>
          </div>

          {/* 오른쪽: 예약 정보 */}
          <div>
            <div className="border rounded-xl p-6 sticky top-8">
              {/* 숙소 정보 */}
              <div className="flex gap-4 mb-6 pb-6 border-b">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={imageUrl}
                    alt={listingTitle || '숙소'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{listingTitle}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    {rating && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
                        </svg>
                        {rating}
                      </span>
                    )}
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">(후기 {reviewCount}개)</span>
                    <span className="text-gray-400">•</span>
                    <span>호스트: {hostName}</span>
                  </div>
                </div>
              </div>

              {/* 환불 정책 */}
              <div className="mb-6 pb-6 border-b">
                <h4 className="font-semibold mb-2">환불 정책</h4>
                <p className="text-sm text-gray-600">
                  {refundPolicy}
                </p>
              </div>

              {/* 날짜 */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex-1">
                  <p className="font-semibold mb-1">날짜</p>
                  {showDateEdit ? (
                    <div className="space-y-2">
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleDateSave}
                          className="px-3 py-1 bg-black text-white text-sm rounded-lg"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => setShowDateEdit(false)}
                          className="px-3 py-1 border text-sm rounded-lg"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">{checkIn} - {checkOut}</p>
                  )}
                </div>
                {!showDateEdit && (
                  <button
                    onClick={() => setShowDateEdit(true)}
                    className="text-sm underline font-semibold"
                  >
                    변경
                  </button>
                )}
              </div>

              {/* 게스트 */}
              <div className="flex justify-between items-center mb-6 pb-6 border-b">
                <div className="flex-1">
                  <p className="font-semibold mb-1">게스트</p>
                  {showGuestEdit ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                          className="w-8 h-8 border rounded-full flex items-center justify-center hover:border-black"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium">{guests}명</span>
                        <button
                          onClick={() => setGuests(guests + 1)}
                          className="w-8 h-8 border rounded-full flex items-center justify-center hover:border-black"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleGuestSave}
                          className="px-3 py-1 bg-black text-white text-sm rounded-lg"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => setShowGuestEdit(false)}
                          className="px-3 py-1 border text-sm rounded-lg"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">성인 {guests}명</p>
                  )}
                </div>
                {!showGuestEdit && (
                  <button
                    onClick={() => setShowGuestEdit(true)}
                    className="text-sm underline font-semibold"
                  >
                    변경
                  </button>
                )}
              </div>

              {/* 요금 세부 정보 */}
              <div className="space-y-3 mb-6 pb-6 border-b">
                <h4 className="font-semibold">요금 세부 정보</h4>
                <div className="flex justify-between text-sm">
                  <span className="underline">
                    {Math.ceil(
                      (new Date(checkOut || '').getTime() - new Date(checkIn || '').getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}
                    박 x ₩{Math.floor(Number(totalPrice || 0) / Math.ceil(
                      (new Date(checkOut || '').getTime() - new Date(checkIn || '').getTime()) /
                        (1000 * 60 * 60 * 24)
                    )).toLocaleString()}
                  </span>
                  <span>₩{Number(totalPrice || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* 총액 */}
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold">총액 KRW</span>
                <span className="font-bold">₩{Number(totalPrice || 0).toLocaleString()}</span>
              </div>
              <button className="text-sm underline mt-2">요금 상세 내역</button>

              {/* 하단 안내 */}
              <div className="mt-6 pt-6 border-t flex items-start gap-3">
                <svg className="w-6 h-6 text-rose-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.5 3.8 10.7 10 12 6.2-1.3 10-6.5 10-12V7L12 2zm0 18c-4.4 0-8-3.6-8-8V8.3l8-4.5 8 4.5V12c0 4.4-3.6 8-8 8z" />
                </svg>
                <div>
                  <p className="font-semibold text-sm">훌륭한 것은 가치입니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}