"use client";

import { useState, useEffect, useCallback } from "react";
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
  X, // 모달 닫기 아이콘 추가
} from "lucide-react";

// 인터페이스는 기존과 동일
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
  // 백엔드 응답에 포함될 수 있는 필드 추가 (location, introduction)
  location?: string;
  introductionText?: string;
}

// 새로운 모달 상태를 위한 인터페이스 정의
interface ModalState {
  isOpen: boolean;
  field: 'location' | 'introduction' | null;
  value: string;
  title: string;
  backendField: string; // 백엔드로 보낼 필드 이름
}

export default function ListingEditorPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = (params?.id as string) || "";
  const [listing, setListing] = useState<ListingData | null>(null);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  // ⭐️⭐️⭐️ 모달 상태 추가 ⭐️⭐️⭐️
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    field: null,
    value: '',
    title: '',
    backendField: '',
  });

  // ----------------------------------------------------
  // API PATCH 요청 함수 (재활용성을 위해 useCallback 사용)
  // ----------------------------------------------------
  const updateListing = useCallback(async (updates: any) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:3001/api/v1/listings/${listingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        // 성공 시, 전체 리스팅 데이터를 다시 불러와 상태 업데이트
        await fetchListing();
        alert('수정되었습니다.');
      } else {
        console.error('Failed to update listing:', response.status);
        alert('수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to update listing:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  }, [listingId]); // listingId가 변경될 때만 함수 재생성

  // ----------------------------------------------------
  // 리스팅 데이터 로드 함수 (API 및 로컬 스토리지)
  // ----------------------------------------------------
  const fetchListing = useCallback(async () => {
    if (!listingId) return;

    try {
      const response = await fetch(`http://localhost:3001/api/v1/listings/${listingId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch listing: ${response.status}`);
      }

      const result = await response.json();
      const data = result.data || result;

      // 백엔드 데이터를 프론트엔드 형식으로 변환 (location 및 introductionText 추가)
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
        location: data.address || '대한민국, 서울', // 장소 데이터 필드 매핑 (백엔드에서는 address)
        introductionText: data.introduction || '게스트에게 본인과 숙소에 대해 소개하세요.', // 호스트 소개 데이터 필드 매핑
      };

      setListing(listingData);
      return true; // API 로드 성공
    } catch (error) {
      console.warn('Failed to load from API:', error);
      return false; // API 로드 실패
    }
  }, [listingId]);

  useEffect(() => {
    const loadData = async () => {
      localStorage.setItem("hasListing", "true");
      const apiLoaded = await fetchListing();

      // API 실패 시 localStorage에서 로드 (기존 로직 유지)
      if (!apiLoaded) {
        const savedData = localStorage.getItem(`listing_${listingId}`);
        if (savedData) {
          try {
            const data = JSON.parse(savedData);
            if (data.photos && Array.isArray(data.photos)) {
              data.photos = data.photos.filter((photo: string) => !photo.startsWith('blob:'));
              localStorage.setItem(`listing_${listingId}`, JSON.stringify(data));
            }
            setListing(data);
            console.log('Listing loaded from localStorage:', data);
          } catch (error) {
            console.error('Failed to load listing from localStorage:', error);
          }
        }
      }
    };

    loadData();
  }, [listingId, fetchListing]);

  // ----------------------------------------------------
  // 모달 제어 핸들러
  // ----------------------------------------------------
  const handleModalOpen = (field: 'location' | 'introduction') => {
    if (!listing) return;

    let title = '';
    let value = '';
    let backendField = '';

    if (field === 'introduction') {
      title = '호스트 소개 수정';
      value = listing.introductionText || '';
      backendField = 'introduction';
    } else if (field === 'location') {
      title = '장소 수정';
      value = listing.location || '';
      backendField = 'address'; // 백엔드 엔티티 필드명은 address
    }

    setModal({
      isOpen: true,
      field,
      value,
      title,
      backendField,
    });
  };

  const handleModalSave = async () => {
    if (!modal.field || !listing) return;

    const updates: { [key: string]: string } = {};
    updates[modal.backendField] = modal.value;

    // 1. API 업데이트 요청
    await updateListing(updates);

    // 2. 모달 닫기
    setModal({ ...modal, isOpen: false });
  };

  // ----------------------------------------------------
  // handleEdit 함수 수정 (프롬프트 대신 모달 호출)
  // ----------------------------------------------------
  const handleEdit = async (section: string) => {
    if (section === '숙소 이름') {
      const newName = prompt('새 숙소 이름을 입력하세요:', listing?.propertyName);
      if (newName && newName !== listing?.propertyName) {
        await updateListing({ title: newName });
      }
    } else if (section === '가격') {
      const newPrice = prompt('새 기본 가격을 입력하세요:', listing?.basePrice.toString());
      if (newPrice && !isNaN(Number(newPrice))) {
        await updateListing({ basePrice: Number(newPrice) });
      }
    } else if (section === '장소') {
      handleModalOpen('location'); // ⭐️ 모달 열기
    } else if (section === '호스트 소개') {
      handleModalOpen('introduction'); // ⭐️ 모달 열기
    } else {
      alert(`${section} 편집 기능은 준비 중입니다.`);
    }
  };

  // ... (handlePhotoUpload, handleAddAccessibility, handleSwitchToGuestMode 함수는 변경 없음)

  // ... (로딩 상태 처리 및 allAmenities 정의는 변경 없음)

  const handlePhotoUpload = async () => { /* ... 기존 로직 유지 ... */ };
  const handleAddAccessibility = () => { alert('접근성 기능 추가는 준비 중입니다.'); };
  const handleSwitchToGuestMode = () => { router.push("/"); };

  if (!listing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">리스팅 정보를 불러오는 중...</p>
      </div>
    );
  }

  const allAmenities = [...(listing.popularAmenities || []), ...(listing.standoutAmenities || [])];


  return (
    <>
      {/* ⭐️⭐️⭐️ 편집 모달 컴포넌트 ⭐️⭐️⭐️ */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">{modal.title}</h2>
              <button onClick={() => setModal({ ...modal, isOpen: false })} className="text-gray-500 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              {modal.field === 'introduction' ? (
                <textarea
                  rows={6}
                  value={modal.value}
                  onChange={(e) => setModal({ ...modal, value: e.target.value })}
                  placeholder="호스트 소개를 입력하세요."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={modal.value}
                  onChange={(e) => setModal({ ...modal, value: e.target.value })}
                  placeholder="장소를 입력하세요 (예: 대한민국, 서울)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
              )}
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={handleModalSave}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-black disabled:bg-gray-400"
                disabled={!modal.value.trim()}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout (기존 내용) */}
      <div className="bg-white">
        <div className="flex h-[calc(100vh-73px)]">
          {/* Left Sidebar */}
          <aside className="w-64 border-r border-gray-200 overflow-y-auto scrollbar-hide">
            {/* ... (기존 Sidebar 내용 유지) ... */}
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

          {/* Right Content */}
          <main className="flex-1 p-6 overflow-y-auto scrollbar-hide">
            <div className="max-w-4xl">
              {/* Photo Tour (사진 관련 섹션은 수정 없음) */}
              {/* ... */}

              {/* 장소 섹션 - 수정된 부분 */}
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
                  <p className="text-sm text-gray-600">{listing.location || '대한민국, 서울 (정보 없음)'}</p>
                </div>
              </div>

              {/* 호스트 소개 섹션 - 수정된 부분 */}
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
                  {listing.introductionText || '게스트에게 본인과 숙소에 대해 소개하세요. (정보 없음)'}
                </p>
              </div>

              {/* ... (나머지 섹션은 수정 없음) ... */}

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
    </>
  );
}