"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import KeyInfoAlert from "@/components/host/KeyInfoAlert";

export default function HostListingsPage() {
  const router = useRouter();

  // 더미 리스팅 데이터
  const listings = [
    {
      id: 1,
      name: "바다가 보이는 아늑한 집",
      location: "서울특별시 강남구",
      status: "게시 중",
      createdAt: "2024년 12월 1일",
      thumbnail: "/images/placeholder-room.jpg",
    },
  ];

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
          {listings.map((listing) => (
            <button
              key={listing.id}
              onClick={() => router.push(`/host/listings/${listing.id}`)}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition text-left"
            >
              <div className="relative aspect-video bg-gray-200">
                <img
                  src={listing.thumbnail}
                  alt={listing.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      listing.status === "게시 중"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {listing.status}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">{listing.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{listing.location}</p>
                <p className="text-xs text-gray-500">
                  작성 시작일: {listing.createdAt}
                </p>
              </div>
            </button>
          ))}

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
