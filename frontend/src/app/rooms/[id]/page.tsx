
'use client';

import React from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useListing } from '@/hooks/useListing';
import { Heart, Share, Star } from 'lucide-react';

export default function ListingDetailsPage() {
    const params = useParams();
    const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;

    const { listing, loading, error } = useListing(id || null);

    if (loading) return <div className="text-center py-20">잠시만 기다려주세요...</div>;
    if (error || !listing) return <div className="text-center py-20 text-red-500">숙소 정보를 불러올 수 없습니다.</div>;

    const mainImage = listing.images?.[0] || 'https://placehold.co/600x400?text=No+Image';
    const price = listing.basePrice || 0;

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

                    {/* Calendar Placeholder */}
                    <div className="py-6">
                        <h3 className="text-xl font-semibold mb-2">체크인 날짜를 선택하세요</h3>
                        <p className="text-gray-500">여행 날짜를 입력하여 정확한 요금을 확인하세요.</p>
                        <div className="h-64 bg-gray-50 mt-4 rounded-xl flex items-center justify-center border">
                            캘린더 컴포넌트 자리
                        </div>
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

                        <div className="border rounded-lg mb-4 overflow-hidden">
                            <div className="flex border-b">
                                <div className="flex-1 p-3 border-r">
                                    <label className="block text-[10px] font-bold uppercase text-gray-700">체크인</label>
                                    <div className="text-gray-400 text-sm">날짜 추가</div>
                                </div>
                                <div className="flex-1 p-3">
                                    <label className="block text-[10px] font-bold uppercase text-gray-700">체크아웃</label>
                                    <div className="text-gray-400 text-sm">날짜 추가</div>
                                </div>
                            </div>
                            <div className="p-3">
                                <label className="block text-[10px] font-bold uppercase text-gray-700">인원</label>
                                <div className="text-sm">게스트 1명</div>
                            </div>
                        </div>

                        <button className="w-full bg-rose-600 text-white py-3 rounded-lg font-semibold hover:bg-rose-700 transition mb-4">
                            예약하기
                        </button>

                        <p className="text-center text-xs text-gray-500 mb-4">예약 확정 전에는 요금이 청구되지 않습니다.</p>

                        <div className="space-y-3 text-gray-600">
                            <div className="flex justify-between underline">
                                <span>₩{price.toLocaleString()} x 5박</span>
                                <span>₩{(price * 5).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between underline">
                                <span>청소비</span>
                                <span>₩20,000</span>
                            </div>
                            <div className="flex justify-between underline">
                                <span>에어비앤비 서비스 수수료</span>
                                <span>₩15,000</span>
                            </div>
                        </div>

                        <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
                            <span>총 합계</span>
                            <span>₩{(price * 5 + 35000).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
