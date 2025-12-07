
'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useListing } from '@/hooks/useListing';
import { Heart, Share, Star } from 'lucide-react';
import Calendar from '@/components/booking/Calendar';
import GuestSelector from '@/components/booking/GuestSelector';

export default function ListingDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;

    const { listing, loading, error } = useListing(id || null);

    // 예약 상태 관리
    const [checkIn, setCheckIn] = useState<string | null>(null);
    const [checkOut, setCheckOut] = useState<string | null>(null);
    const [guests, setGuests] = useState(1);
    const [showCalendar, setShowCalendar] = useState(false);
    const [isBooking, setIsBooking] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);

    // 날짜 선택 핸들러
    const handleDateSelect = (newCheckIn: string | null, newCheckOut: string | null) => {
        setCheckIn(newCheckIn);
        setCheckOut(newCheckOut);
    };

    // 숙박 일수 계산
    const nights = useMemo(() => {
        if (!checkIn || !checkOut) return 0;
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const diffTime = checkOutDate.getTime() - checkInDate.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }, [checkIn, checkOut]);

    // 요금 계산
    const price = listing?.basePrice || 0;
    const cleaningFee = 20000;
    const serviceFee = Math.round(price * nights * 0.05);
    const totalPrice = (price * nights) + cleaningFee + serviceFee;

    // 예약하기 핸들러 - 채팅으로 예약 요청
    const handleBooking = async () => {
        if (!checkIn || !checkOut || !id) {
            setBookingError('체크인/체크아웃 날짜를 선택해주세요.');
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }

        // 호스트 ID 확인
        if (!listing.host?.id) {
            setBookingError('호스트 정보를 찾을 수 없습니다.');
            return;
        }

        setIsBooking(true);
        setBookingError(null);

        try {
            // 1. 호스트와 채팅방 생성
            const chatResponse = await fetch('http://localhost:3001/api/v1/chat/conversations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    participantId: listing.host.id,
                    title: `${listing.title} 예약 문의`,
                }),
            });

            if (!chatResponse.ok) {
                const errorData = await chatResponse.json();
                console.error('Chat creation error:', errorData);
                throw new Error('채팅방 생성에 실패했습니다.');
            }

            const response = await chatResponse.json();
            console.log('Created conversation response:', response);

            // TransformInterceptor가 { success: true, data: {...} } 형태로 래핑
            const conversation = response.data || response;
            const conversationId = conversation.id;
            if (!conversationId) {
                console.error('No conversation ID in response:', response);
                throw new Error('채팅방 ID를 가져올 수 없습니다.');
            }

            // 2. 예약 내역 메시지 전송
            const bookingMessage = `🏠 예약 요청

📍 숙소: ${listing.title}
📆 체크인: ${checkIn}
📆 체크아웃: ${checkOut}
👥 게스트: ${guests}명
💰 예상 금액: ₩${totalPrice.toLocaleString()}

예약 가능 여부를 확인해주세요!`;

            const messageResponse = await fetch(`http://localhost:3001/api/v1/chat/conversations/${conversationId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    content: bookingMessage,
                }),
            });

            if (!messageResponse.ok) {
                console.error('Message send failed');
            }

            // 3. 채팅 페이지로 이동 (새 창이 아닌 현재 창에서)
            router.push(`/messages/${conversationId}`);
        } catch (err) {
            console.error('Booking error:', err);
            setBookingError(err instanceof Error ? err.message : '예약 요청 중 오류가 발생했습니다.');
        } finally {
            setIsBooking(false);
        }
    };

    if (loading) return <div className="text-center py-20">잠시만 기다려주세요...</div>;
    if (error || !listing) return <div className="text-center py-20 text-red-500">숙소 정보를 불러올 수 없습니다.</div>;

    const mainImage = listing.images?.[0] || 'https://placehold.co/600x400?text=No+Image';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Title Header */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>

            <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                    {listing.rating ? (
                        <span className="flex items-center gap-1 font-medium text-black">
                            <Star className="w-4 h-4 fill-black" /> {listing.rating}
                        </span>
                    ) : <span className="font-medium">New</span>
                    }
                    <span>·</span>
                    <span className="underline font-medium text-black">{listing.reviewCount || 0}개 후기</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 underline font-medium text-black">
                        {listing.address}
                    </span>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded-md transition underlined">
                        <Share className="w-4 h-4" /> 공유하기
                    </button>
                    <button className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded-md transition underlined">
                        <Heart className="w-4 h-4" /> 저장
                    </button>
                </div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] mb-8 rounded-xl overflow-hidden">
                {/* Main Image (Big Left) */}
                <div className="col-span-2 row-span-2 relative">
                    <Image
                        src={mainImage}
                        alt="Main view"
                        fill
                        priority
                        className="object-cover hover:brightness-95 transition cursor-pointer"
                    />
                </div>

                {/* Sub Images */}
                {[1, 2, 3, 4].map((idx) => (
                    <div key={idx} className="relative hidden md:block">
                        {listing.images?.[idx] ? (
                            <Image
                                src={listing.images[idx]}
                                alt={`View ${idx}`}
                                fill
                                className="object-cover hover:brightness-95 transition cursor-pointer"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                Map
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Content Grid (Info + Sidebar) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Left Column: Info */}
                <div className="md:col-span-2 space-y-8">
                    {/* Host Section */}
                    <div className="flex justify-between items-center border-b pb-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-1">
                                {listing.host?.name || '호스트'}님이 호스팅하는 {listing.roomType}
                            </h2>
                            <p className="text-gray-600">
                                최대 인원 {listing.maxGuests}명 · 침실 {listing.bedrooms}개 · 침대 {listing.beds}개 · 욕실 {listing.bathrooms}개
                            </p>
                        </div>
                        <div className="w-14 h-14 relative rounded-full overflow-hidden bg-gray-200">
                            <Image
                                src={listing.host?.avatarUrl || "https://placehold.co/100x100?text=Host"}
                                alt={listing.host?.name || "Host"}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="border-b pb-6">
                        <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                            {listing.description}
                        </p>
                    </div>

                    {/* Amenities */}
                    <div className="border-b pb-6">
                        <h3 className="text-xl font-semibold mb-4">숙소 편의시설</h3>
                        <ul className="grid grid-cols-2 gap-4">
                            {listing.amenities?.length > 0 ? (
                                listing.amenities.map((amenity, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                                        <span>✔ {amenity}</span>
                                    </li>
                                ))
                            ) : (
                                <li className="text-gray-500">등록된 편의시설이 없습니다.</li>
                            )}
                        </ul>
                    </div>

                    {/* Calendar Section */}
                    <div className="py-6">
                        <h3 className="text-xl font-semibold mb-2">
                            {nights > 0 ? `${nights}박` : '체크인 날짜를 선택하세요'}
                        </h3>
                        <p className="text-gray-500 mb-4">
                            {checkIn && checkOut
                                ? `${checkIn} ~ ${checkOut}`
                                : '여행 날짜를 입력하여 정확한 요금을 확인하세요.'}
                        </p>
                        <Calendar
                            checkIn={checkIn}
                            checkOut={checkOut}
                            onDateSelect={handleDateSelect}
                        />
                    </div>
                </div>

                {/* Right Column: Booking Widget */}
                <div className="relative">
                    <div className="sticky top-24 border rounded-xl shadow-xl p-6 bg-white">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <span className="text-xl font-bold">₩{price.toLocaleString('ko-KR')}</span>
                                <span className="text-gray-500 text-sm"> / 박</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                                <Star className="w-3 h-3 fill-black" />
                                <span className="font-medium">{listing.rating || "New"}</span>
                            </div>
                        </div>

                        {/* 날짜 선택 영역 */}
                        <div
                            className="border rounded-lg mb-4 overflow-hidden cursor-pointer hover:border-gray-900 transition"
                            onClick={() => setShowCalendar(!showCalendar)}
                        >
                            <div className="flex border-b">
                                <div className="flex-1 p-3 border-r">
                                    <label className="block text-[10px] font-bold uppercase text-gray-700">체크인</label>
                                    <div className={`text-sm ${checkIn ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {checkIn || '날짜 추가'}
                                    </div>
                                </div>
                                <div className="flex-1 p-3">
                                    <label className="block text-[10px] font-bold uppercase text-gray-700">체크아웃</label>
                                    <div className={`text-sm ${checkOut ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {checkOut || '날짜 추가'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 캘린더 팝업 */}
                        {showCalendar && (
                            <div className="absolute left-0 right-0 top-28 z-50 bg-white border rounded-xl shadow-2xl p-4">
                                <Calendar
                                    checkIn={checkIn}
                                    checkOut={checkOut}
                                    onDateSelect={(ci, co) => {
                                        handleDateSelect(ci, co);
                                        if (ci && co) setShowCalendar(false);
                                    }}
                                />
                            </div>
                        )}

                        {/* 인원 선택 */}
                        <div className="mb-4">
                            <GuestSelector
                                guests={guests}
                                maxGuests={listing.maxGuests || 10}
                                onChange={setGuests}
                            />
                        </div>

                        {/* 에러 메시지 */}
                        {bookingError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {bookingError}
                            </div>
                        )}

                        <button
                            onClick={handleBooking}
                            disabled={isBooking || !checkIn || !checkOut}
                            className={`w-full py-3 rounded-lg font-semibold transition mb-4 ${isBooking || !checkIn || !checkOut
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-rose-600 text-white hover:bg-rose-700'
                                }`}
                        >
                            {isBooking ? '예약 중...' : (checkIn && checkOut ? '예약하기' : '날짜를 선택하세요')}
                        </button>

                        <p className="text-center text-xs text-gray-500 mb-4">예약 확정 전에는 요금이 청구되지 않습니다.</p>

                        {nights > 0 && (
                            <>
                                <div className="space-y-3 text-gray-600">
                                    <div className="flex justify-between">
                                        <span className="underline">₩{price.toLocaleString()} x {nights}박</span>
                                        <span>₩{(price * nights).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="underline">청소비</span>
                                        <span>₩{cleaningFee.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="underline">에어비앤비 서비스 수수료</span>
                                        <span>₩{serviceFee.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
                                    <span>총 합계</span>
                                    <span>₩{totalPrice.toLocaleString()}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
