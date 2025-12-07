"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Upload,
  Wifi,
  Tv,
  Car,
  Wind,
  Package,
  Plus,
} from "lucide-react";

interface ListingData {
  propertyName: string;
  propertyType: string;
  basePrice: number;
  photos: string[];
  bedrooms: number;
  beds: number;
  bathrooms: number;
  guests: number;
  popularAmenities: string[];
  standoutAmenities: string[];
}

export default function ListingEditorPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = (params?.id as string) || "";
  const [listing, setListing] = useState<ListingData | null>(null);

  useEffect(() => {
    // 리스팅 ID를 로컬 스토리지에 저장 (호스트 모드 활성화)
    if (listingId) {
      localStorage.setItem("hasListing", "true");
      
      // localStorage에서 리스팅 데이터 로드
      const savedData = localStorage.getItem(`listing_${listingId}`);
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          setListing(data);
        } catch (error) {
          console.error('Failed to load listing:', error);
        }
      }
    }
  }, [listingId]);

  const handleSwitchToGuestMode = () => {
    router.push("/");
  };

  // 로딩 중이거나 데이터가 없을 때
  if (!listing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">리스팅 정보를 불러오는 중...</p>
      </div>
    );
  }

  const allAmenities = [...(listing.popularAmenities || []), ...(listing.standoutAmenities || [])];

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-80 border-r border-gray-200 h-screen overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Listing Preview Card */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                {listing.photos.length > 0 ? (
                  <img
                    src={listing.photos[0]}
                    alt="Listing"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "";
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <Upload size={48} className="text-gray-400" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{listing.propertyName}</h3>
                <p className="text-sm text-gray-600 mb-1">{listing.propertyType || '주택'}</p>
                <p className="text-sm font-medium">
                  ₩{listing.basePrice?.toLocaleString() || '64,115'} / 박
                </p>
              </div>
            </div>

            {/* Complete Required Steps */}
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Package size={20} />
                필수 단계 완료하기
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                숙소를 게시하기 전에 몇 가지 필수 사항을 완료하세요.
              </p>
              <button className="w-full px-4 py-2 bg-white border border-gray-900 rounded-lg font-medium hover:bg-gray-50">
                시작하기
              </button>
            </div>

            {/* Listing Details Summary */}
            <div className="space-y-4">
              <h3 className="font-semibold">숙소 정보</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">게스트</span>
                  <span className="font-medium">{listing.guests}명</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">침실</span>
                  <span className="font-medium">{listing.bedrooms}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">침대</span>
                  <span className="font-medium">{listing.beds}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">욕실</span>
                  <span className="font-medium">{listing.bathrooms}개</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h3 className="font-semibold">편의시설</h3>
              <div className="space-y-2">
                {allAmenities.slice(0, 5).map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {amenity === "와이파이" && <Wifi size={16} />}
                    {amenity === "TV" && <Tv size={16} />}
                    {amenity === "무료 주차" && <Car size={16} />}
                    {amenity === "에어컨" && <Wind size={16} />}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
              <button className="text-sm font-medium underline">
                편의시설 {allAmenities.length}개 모두 보기
              </button>
            </div>

            {/* Accessibility */}
            <div className="space-y-4">
              <h3 className="font-semibold">접근성</h3>
              <p className="text-sm text-gray-600">
                접근성 기능을 추가하지 않았습니다.
              </p>
              <button className="text-sm font-medium underline">
                접근성 기능 추가하기
              </button>
            </div>
          </div>
        </aside>

        {/* Right Content - Photo Tour */}
        <main className="flex-1 p-8 overflow-y-auto h-screen">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-semibold mb-8">포토 투어</h2>

            <p className="text-gray-600 mb-8">
              게스트가 숙소 곳곳을 확인할 수 있도록 5장 이상의 사진을
              추가해주세요. 나중에 언제든지 사진을 추가하거나 변경할 수
              있습니다.
            </p>

            {/* Cover Photo */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4">커버 사진</h3>
              <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
                {listing.photos[0] ? (
                  <img
                    src={listing.photos[0]}
                    alt="Cover"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "";
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="text-center">
                    <Upload size={48} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">커버 사진 추가</p>
                  </div>
                )}
                <button className="absolute bottom-4 right-4 px-4 py-2 bg-white border border-gray-900 rounded-lg font-medium shadow-lg hover:bg-gray-50">
                  사진 업로드
                </button>
              </div>
            </div>

            {/* Photo Sections */}
            <div className="space-y-8">
              {/* Bedroom Photos */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">침실 {listing.bedrooms}개</h3>
                  <button className="text-sm font-medium underline">
                    편집
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[1].map((_, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 cursor-pointer"
                    >
                      <Plus size={32} className="text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bathroom Photos */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">욕실 {listing.bathrooms}개</h3>
                  <button className="text-sm font-medium underline">
                    편집
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[1].map((_, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 cursor-pointer"
                    >
                      <Plus size={32} className="text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Photos */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">추가 사진</h3>
                  <button className="text-sm font-medium underline">
                    편집
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {listing.photos.slice(1, 4).map((photo, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-300"
                    >
                      <img
                        src={photo}
                        alt={`Additional ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "";
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  ))}
                  <div className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 cursor-pointer">
                    <Plus size={32} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
