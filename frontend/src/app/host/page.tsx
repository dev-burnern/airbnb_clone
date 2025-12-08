"use client";

import { BookOpen, Calendar, User, Home, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import HostRegistrationModal from "@/components/host/HostRegistrationModal";

interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  totalPrice: number;
  status: string;
  guest: {
    id: string;
    name: string;
    email: string;
  };
  listing: {
    id: string;
    title: string;
    images: string[];
  };
}

export default function HostDashboardPage() {
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"today" | "scheduled">("today");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasListings, setHasListings] = useState(false);

  // 예약 목록 가져오기
  const fetchBookings = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const endpoint = activeTab === "today"
        ? '/backend/api/v1/bookings/host/today'
        : '/backend/api/v1/bookings/host/upcoming';

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(Array.isArray(data) ? data : (data.data || []));
      }
    } catch (error) {
      console.error('예약 목록 가져오기 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  // 리스팅 존재 확인
  const checkListings = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch('/backend/api/v1/listings/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const listings = Array.isArray(data) ? data : (data.data || []);
        setHasListings(listings.length > 0);
      }
    } catch (error) {
      console.error('리스팅 확인 실패:', error);
    }
  }, []);

  useEffect(() => {
    checkListings();
    fetchBookings();
  }, [checkListings, fetchBookings]);

  // 예약 상태에 따른 배지 색상
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'PAID':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">확정됨</span>;
      case 'PENDING':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">대기중</span>;
      case 'CANCELLED':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">취소됨</span>;
      case 'COMPLETED':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">완료</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{status}</span>;
    }
  };

  // 날짜 포맷
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  // 예약 상태 변경
  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch(`/backend/api/v1/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchBookings(); // 목록 새로고침
      }
    } catch (error) {
      console.error('상태 변경 실패:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("today")}
            className={`pb-3 px-1 border-b-2 font-semibold ${activeTab === "today"
                ? "border-gray-900"
                : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
          >
            오늘
          </button>
          <button
            onClick={() => setActiveTab("scheduled")}
            className={`pb-3 px-1 border-b-2 font-semibold ${activeTab === "scheduled"
                ? "border-gray-900"
                : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
          >
            예정
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : bookings.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20">
            <BookOpen size={64} className="text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">예약이 없습니다</h2>
            <p className="text-gray-600 mb-8">
              {activeTab === "today"
                ? "오늘 체크인 또는 체크아웃 예정인 예약이 없습니다."
                : "게스트가 숙소를 예약하면 여기에 표시됩니다."}
            </p>
            {!hasListings && (
              <button
                onClick={() => setHostModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#E61E4D] to-[#D70466] text-white rounded-lg font-semibold hover:from-[#D70466] hover:to-[#BD1E59] transition"
              >
                리스팅 만들기
              </button>
            )}
          </div>
        ) : (
          /* Booking List */
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    {/* 숙소 이미지 */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {booking.listing.images?.[0] ? (
                        <img
                          src={booking.listing.images[0]}
                          alt={booking.listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home className="text-gray-400" size={24} />
                        </div>
                      )}
                    </div>

                    {/* 예약 정보 */}
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{booking.listing.title}</h3>
                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                        <Calendar size={14} />
                        <span>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <User size={14} />
                        <span>{booking.guest.name} · 게스트 {booking.guestCount}명</span>
                      </div>
                    </div>
                  </div>

                  {/* 상태 및 액션 */}
                  <div className="flex flex-col items-end gap-3">
                    {getStatusBadge(booking.status)}
                    <div className="text-lg font-semibold">
                      ₩{Math.round(Number(booking.totalPrice)).toLocaleString()}
                    </div>

                    {/* 대기중인 예약에 대한 액션 버튼 */}
                    {booking.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                        >
                          <CheckCircle size={14} />
                          승인
                        </button>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'CANCELLED')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
                        >
                          <XCircle size={14} />
                          거절
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 호스트 등록 모달 */}
      <HostRegistrationModal
        isOpen={hostModalOpen}
        onClose={() => setHostModalOpen(false)}
      />
    </div>
  );
}
