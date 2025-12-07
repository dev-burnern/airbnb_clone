"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import HostRegistrationModal from "@/components/host/HostRegistrationModal";

interface Listing {
  id: string;
  propertyName: string;
  propertyType: string;
  basePrice: number;
  photos: string[];
  hostAddress: {
    roadAddress: string;
    city: string;
  };
  createdAt: string;
}

export default function HostListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadListings = () => {
    const allListings: Listing[] = [];
    
    // localStorage의 모든 키를 순회하며 listing_으로 시작하는 항목 찾기
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('listing_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.propertyName) {
            allListings.push({
              id: key.replace('listing_', ''),
              ...data,
              createdAt: data.createdAt || new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error('Failed to parse listing:', error);
        }
      }
    }
    
    setListings(allListings);
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleDelete = (e: React.MouseEvent, listingId: string) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    
    if (confirm('정말 이 리스팅을 삭제하시겠습니까?')) {
      // localStorage에서 삭제
      localStorage.removeItem(`listing_${listingId}`);
      
      // 리스팅이 하나도 없으면 hasListing도 제거
      const remainingListings = listings.filter(l => l.id !== listingId);
      if (remainingListings.length === 0) {
        localStorage.removeItem('hasListing');
      }
      
      // 목록 새로고침
      loadListings();
    }
  };

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
          {listings.map((listing) => {
            const thumbnail = listing.photos?.[0] || "/images/placeholder-room.jpg";
            const location = `${listing.hostAddress?.city || ''} ${listing.hostAddress?.roadAddress || ''}`.trim() || '위치 정보 없음';
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
                      alt={listing.propertyName}
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
                    <h3 className="font-semibold mb-1">{listing.propertyName}</h3>
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
          })}
        </div>
      </div>

      {/* Host Registration Modal */}
      <HostRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
