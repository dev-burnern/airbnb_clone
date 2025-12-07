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
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  useEffect(() => {
    // 리스팅 ID를 로컬 스토리지에 저장 (호스트 모드 활성화)
    if (listingId) {
      localStorage.setItem("hasListing", "true");
      
      // 백엔드 API에서 리스팅 데이터 로드
      fetchListing();
    }
  }, [listingId]);

  const fetchListing = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/listings/${listingId}`);
      if (!response.ok) {
        console.error('Failed to fetch listing:', response.status);
        return;
      }
      
      const result = await response.json();
      const data = result.data || result;
      
      console.log('Fetched listing from backend:', data);
      console.log('Images array:', data.images);
      console.log('Images count:', data.images?.length);
      
      // 백엔드 데이터를 프론트엔드 형식으로 변환
      const listingData: ListingData = {
        propertyName: data.title || '',
        propertyType: data.type || '주택',
        basePrice: data.basePrice || 0,
        photos: data.images || [],
        bedrooms: data.bedrooms || 1,
        beds: data.beds || 1,
        bathrooms: data.bathrooms || 1,
        guests: data.maxGuests || 1,
        popularAmenities: Array.isArray(data.amenities) ? data.amenities.slice(0, 5) : [],
        standoutAmenities: Array.isArray(data.amenities) ? data.amenities.slice(5) : [],
      };
      
      console.log('Converted listing data:', listingData);
      console.log('Photos in listing:', listingData.photos);
      
      setListing(listingData);
    } catch (error) {
      console.error('Failed to load listing:', error);
    }
  };

  const handlePhotoUpload = async () => {
    // input 엘리먼트를 생성하고 클릭
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    
    input.onchange = async (event) => {
      const files = (event.target as HTMLInputElement).files;
      console.log('Files selected:', files?.length);
      
      if (files && files.length > 0 && listing) {
        console.log('Processing files...');
        // 파일을 Base64로 변환
        const filePromises = Array.from(files).map((file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
          });
        });
        
        const newPhotos = await Promise.all(filePromises);
        console.log('New photos converted:', newPhotos.length);
        
        const updatedListing = {
          ...listing,
          photos: [...listing.photos, ...newPhotos],
        };
        
        console.log('Updated listing photos count:', updatedListing.photos.length);
        
        // localStorage 업데이트
        localStorage.setItem(`listing_${listingId}`, JSON.stringify(updatedListing));
        setListing(updatedListing);
        
        console.log('Listing updated successfully');
      }
    };
    
    input.click();
  };

  const handleEdit = (section: string) => {
    alert(`${section} 편집 기능은 준비 중입니다.`);
  };

  const handleAddAccessibility = () => {
    alert('접근성 기능 추가는 준비 중입니다.');
  };

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
    <div className="bg-white">
      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-gray-200 overflow-y-auto scrollbar-hide">
          <div className="p-4 space-y-4">
            {/* Listing Preview Card */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-200 flex items-center justify-center relative">
                {listing.photos.length > 0 ? (
                  <img
                    src={listing.photos[0]}
                    alt="Listing"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Failed to load image:', listing.photos[0]?.substring(0, 100));
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = 'flex flex-col items-center justify-center text-gray-400';
                        fallback.innerHTML = '<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><span class="text-xs mt-2">이미지 로드 실패</span>';
                        parent.appendChild(fallback);
                      }
                    }}
                    onLoad={() => console.log('Image loaded successfully')}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Upload size={32} />
                    <span className="text-xs mt-2">이미지 없음</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm mb-1">{listing.propertyName}</h3>
                <p className="text-xs text-gray-600 mb-1">{listing.propertyType || '주택'}</p>
                <p className="text-xs font-medium">
                  ₩{listing.basePrice?.toLocaleString() || '64,115'} / 박
                </p>
              </div>
            </div>

            {/* Complete Required Steps */}
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
              <h3 className="font-semibold text-sm mb-1 flex items-center gap-2">
                <Package size={16} />
                필수 단계 완료하기
              </h3>
              <p className="text-xs text-gray-600 mb-2">
                숙소를 게시하기 전에 몇 가지 필수 사항을 완료하세요.
              </p>
              <button className="w-full px-3 py-1.5 text-sm bg-white border border-gray-900 rounded-lg font-medium hover:bg-gray-50">
                시작하기
              </button>
            </div>

            {/* Listing Details Summary */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">숙소 정보</h3>
              <div className="space-y-2 text-xs">
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
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">편의시설</h3>
              <div className="space-y-1.5">
                {(showAllAmenities ? allAmenities : allAmenities.slice(0, 5)).map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    {amenity === "와이파이" && <Wifi size={14} />}
                    {amenity === "TV" && <Tv size={14} />}
                    {amenity === "무료 주차" && <Car size={14} />}
                    {amenity === "에어컨" && <Wind size={14} />}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setShowAllAmenities(!showAllAmenities)}
                className="text-xs font-medium underline hover:text-gray-900"
              >
                {showAllAmenities ? '접기' : `편의시설 ${allAmenities.length}개 모두 보기`}
              </button>
            </div>

            {/* Accessibility */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">접근성</h3>
              <p className="text-xs text-gray-600">
                접근성 기능을 추가하지 않았습니다.
              </p>
              <button 
                onClick={handleAddAccessibility}
                className="text-xs font-medium underline hover:text-gray-900"
              >
                접근성 기능 추가하기
              </button>
            </div>
          </div>
        </aside>

        {/* Right Content - Photo Tour */}
        <main className="flex-1 p-6 overflow-y-auto scrollbar-hide">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-semibold mb-6">포토 투어</h2>

            <p className="text-sm text-gray-600 mb-6">
              게스트가 숙소 곳곳을 확인할 수 있도록 5장 이상의 사진을
              추가해주세요. 나중에 언제든지 사진을 추가하거나 변경할 수
              있습니다.
            </p>

            {/* Cover Photo */}
            <div className="mb-6">
              <h3 className="font-semibold text-sm mb-3">커버 사진</h3>
              <div className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
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
                    <Upload size={32} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">커버 사진 추가</p>
                  </div>
                )}
                <button 
                  onClick={handlePhotoUpload}
                  className="absolute bottom-3 right-3 px-3 py-1.5 text-sm bg-white border border-gray-900 rounded-lg font-medium shadow-lg hover:bg-gray-50"
                >
                  사진 업로드
                </button>
              </div>
            </div>

            {/* Bedrooms */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">침실 {listing.bedrooms}개</h3>
                <button 
                  onClick={() => handleEdit('침실')}
                  className="text-xs font-medium underline hover:text-gray-900"
                >
                  편집
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[1].map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 cursor-pointer"
                    onClick={handlePhotoUpload}
                  >
                    <Plus size={24} className="text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Bathrooms */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">욕실 {listing.bathrooms}개</h3>
                <button 
                  onClick={() => handleEdit('욕실')}
                  className="text-xs font-medium underline hover:text-gray-900"
                >
                  편집
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[1].map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 cursor-pointer"
                    onClick={handlePhotoUpload}
                  >
                    <Plus size={24} className="text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Photos */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">추가 사진</h3>
                <button 
                  onClick={() => handleEdit('추가 사진')}
                  className="text-xs font-medium underline hover:text-gray-900"
                >
                  편집
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
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
                <div 
                  className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 cursor-pointer"
                  onClick={handlePhotoUpload}
                >
                  <Plus size={24} className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* 편의시설 섹션 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">편의시설</h2>
                <button 
                  onClick={() => handleEdit('편의시설')}
                  className="text-sm font-medium underline hover:text-gray-900"
                >
                  편집
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {allAmenities.slice(0, 6).map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {amenity === "와이파이" && <Wifi size={20} />}
                    {amenity === "TV" && <Tv size={20} />}
                    {amenity === "무료 주차" && <Car size={20} />}
                    {amenity === "에어컨" && <Wind size={20} />}
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 장소 섹션 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">장소</h2>
                <button 
                  onClick={() => handleEdit('장소')}
                  className="text-sm font-medium underline hover:text-gray-900"
                >
                  편집
                </button>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm text-gray-600">대한민국, 서울</p>
              </div>
            </div>

            {/* 호스트 소개 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">호스트 소개</h2>
                <button 
                  onClick={() => handleEdit('호스트 소개')}
                  className="text-sm font-medium underline hover:text-gray-900"
                >
                  편집
                </button>
              </div>
              <p className="text-sm text-gray-600">
                게스트에게 본인과 숙소에 대해 소개하세요.
              </p>
            </div>

            {/* 예약 설정 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">예약 설정</h2>
                <button 
                  onClick={() => handleEdit('예약 설정')}
                  className="text-sm font-medium underline hover:text-gray-900"
                >
                  편집
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  최초 5건의 예약은 직접 검토해 승인하고 그 후에는 즉시 예약 기능을 사용합니다.
                </p>
              </div>
            </div>

            {/* 숙소 이용규칙 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">숙소 이용규칙</h2>
                <button 
                  onClick={() => handleEdit('숙소 이용규칙')}
                  className="text-sm font-medium underline hover:text-gray-900"
                >
                  편집
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">체크인 가능 시간</span>
                  <span className="text-sm font-medium">오후 3:00 이후</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">게스트 정원</span>
                  <span className="text-sm font-medium">{listing.guests}명</span>
                </div>
              </div>
            </div>

            {/* 게스트 안전 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">게스트 안전</h2>
                <button 
                  onClick={() => handleEdit('게스트 안전')}
                  className="text-sm font-medium underline hover:text-gray-900"
                >
                  편집
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">?</span>
                  </div>
                  <p className="text-sm text-gray-700">일산화탄소 경보기 설치 여부 정보 없음</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">?</span>
                  </div>
                  <p className="text-sm text-gray-700">화재경보기 설치 여부 정보 없음</p>
                </div>
              </div>
            </div>

            {/* 환불 정책 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">환불 정책</h2>
                <button 
                  onClick={() => handleEdit('환불 정책')}
                  className="text-sm font-medium underline hover:text-gray-900"
                >
                  편집
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium mb-1">유연</p>
                <p className="text-xs text-gray-600">
                  체크인 24시간 전까지 전액 환불 가능
                </p>
              </div>
            </div>

            {/* 맞춤 링크 */}
            <div className="mt-8 pt-6 border-t border-gray-200 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">맞춤 링크</h2>
                <button 
                  onClick={() => handleEdit('맞춤 링크')}
                  className="text-sm font-medium underline hover:text-gray-900"
                >
                  편집
                </button>
              </div>
              <p className="text-sm text-gray-600">
                게스트에게 유용한 링크를 추가하세요.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
