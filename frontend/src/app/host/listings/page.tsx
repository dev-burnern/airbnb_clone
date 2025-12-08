"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import HostRegistrationModal from "@/components/host/HostRegistrationModal";

interface Listing {
  id: string;
  title: string;
  type: string;
  basePrice: number;
  images: string[];
  address: string;
  createdAt: string;
}

export default function HostListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadListings = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('No token found, user not logged in');
        setLoading(false);
        return;
      }

      // 백엔드 API에서 현재 사용자의 리스팅 가져오기
      const response = await fetch('http://localhost:3001/api/v1/listings/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch listings:', response.status);
        setLoading(false);
        return;
      }

      const result = await response.json();
      const data = Array.isArray(result) ? result : (result.data || []);

      console.log('Fetched listings from backend:', data);

      // 현재 사용자의 리스팅만 필터링 (백엔드에서 필터링하는 것이 더 좋지만, 임시로 클라이언트에서 처리)
      setListings(data);

      // 리스팅이 있으면 hasListing 플래그 설정
      if (data.length > 0) {
        localStorage.setItem("hasListing", "true");
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to load listings:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleDelete = async (e: React.MouseEvent, listingId: string) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지

    if (confirm('정말 이 리스팅을 삭제하시겠습니까?')) {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`http://localhost:3001/api/v1/listings/${listingId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          // 목록 새로고침
          loadListings();
        } else {
          alert('리스팅 삭제에 실패했습니다.');
        }
      } catch (error) {
        console.error('Failed to delete listing:', error);
        alert('리스팅 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">리스팅을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold">리스팅</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-900 rounded-lg font-medium hover:bg-gray-50"
          >
            <Plus size={20} />
            새 리스팅
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 mb-4">아직 등록된 리스팅이 없습니다.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700"
              >
                <Plus size={20} />
                첫 리스팅 만들기
              </button>
            </div>
          ) : (
            listings.map((listing) => {
              const thumbnail = listing.images?.[0] || "/images/placeholder-room.jpg";
              const location = listing.address || '위치 정보 없음';
              const formattedDate = new Date(listing.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });

              return (
                <div
                  key={listing.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition relative group"
                >
                  <button
                    onClick={() => router.push(`/host/listings/${listing.id}`)}
                    className="w-full text-left"
                  >
                    <div className="relative aspect-video bg-gray-200">
                      <img
                        src={thumbnail}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          게시 중
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1">{listing.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{location}</p>
                      <p className="text-xs text-gray-500">
                        작성 시작일: {formattedDate}
                      </p>
                    </div>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDelete(e, listing.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition hover:bg-red-50"
                    title="리스팅 삭제"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Host Registration Modal */}
      <HostRegistrationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          // 모달 닫을 때 리스팅 목록 새로고침
          loadListings();
        }}
      />
    </div>
  );
}
