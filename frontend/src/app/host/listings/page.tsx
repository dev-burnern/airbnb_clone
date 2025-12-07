"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import KeyInfoAlert from "@/components/host/KeyInfoAlert";

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

  useEffect(() => {
    // localStorage에서 모든 리스팅 데이터 가져오기
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

    loadListings();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <KeyInfoAlert />

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold">리스팅</h1>
          <button
            onClick={() => router.push("/host/listings/new")}
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
              <button
                key={listing.id}
                onClick={() => router.push(`/host/listings/${listing.id}`)}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition text-left"
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
            );
          })}

          {/* Add New Listing Card */}
          <button
            onClick={() => router.push("/host/listings/new")}
            className="border-2 border-dashed border-gray-300 rounded-lg aspect-video flex flex-col items-center justify-center hover:border-gray-900 transition"
          >
            <Plus size={48} className="text-gray-400 mb-2" />
            <span className="text-gray-600 font-medium">새 리스팅 추가</span>
          </button>
        </div>
      </div>
    </div>
  );
}
