'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AccommodationList } from '@/widgets/accommodation-list/AccommodationList';

interface AccommodationData {
  id: string;
  title: string;
  location: string;
  imageSrc: string;
  price: number;
  rating: number;
  dates: string;
  isWished?: boolean;
}

interface Listing {
  id: string;
  title: string;
  address: string;
  images: string[];
  basePrice: number;
  latitude: number;
  longitude: number;
}

export default function MainPage() {
  const searchParams = useSearchParams();
  const [jejuListings, setJejuListings] = useState<AccommodationData[]>([]);
  const [osakaListings, setOsakaListings] = useState<AccommodationData[]>([]);
  const [loading, setLoading] = useState(true);

  // 검색 파라미터 추출
  const destination = searchParams?.get('destination');
  const checkIn = searchParams?.get('checkIn');
  const checkOut = searchParams?.get('checkOut');
  const guests = searchParams?.get('guests');

  useEffect(() => {
    fetchListings();
  }, [searchParams]);

  const fetchListings = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/listings');
      const result = await response.json();

      // 백엔드 응답 구조 처리 (배열 또는 { data: [] } 형태)
      const data = Array.isArray(result) ? result : (result.data || result.listings || []);

      if (!Array.isArray(data)) {
        console.error('API 응답이 배열 형태가 아닙니다:', result);
        return;
      }

      console.log(`총 ${data.length}개 숙소 로드됨`);

      // 필터링 로직
      let filteredListings = data;

      // 여행지 필터 (한국: 대구, 부산, 제주, 서울 / 해외: 일본, 필리핀, 미국)
      if (destination) {
        const destLower = destination.toLowerCase();
        filteredListings = filteredListings.filter((listing: Listing) => {
          const addressLower = listing.address.toLowerCase();
          const titleLower = listing.title.toLowerCase();
          
          // 정확한 도시/국가명 매칭
          return addressLower.includes(destLower) || 
                 titleLower.includes(destLower) ||
                 // 한국 도시
                 (destLower === '서울' && (addressLower.includes('seoul') || addressLower.includes('서울'))) ||
                 (destLower === '부산' && (addressLower.includes('busan') || addressLower.includes('부산'))) ||
                 (destLower === '제주' && (addressLower.includes('jeju') || addressLower.includes('제주'))) ||
                 (destLower === '대구' && (addressLower.includes('daegu') || addressLower.includes('대구'))) ||
                 // 해외 국가
                 (destLower === '일본' && (addressLower.includes('japan') || addressLower.includes('일본') || addressLower.includes('tokyo') || addressLower.includes('osaka'))) ||
                 (destLower === '필리핀' && (addressLower.includes('philippines') || addressLower.includes('필리핀') || addressLower.includes('manila'))) ||
                 (destLower === '미국' && (addressLower.includes('usa') || addressLower.includes('america') || addressLower.includes('미국') || addressLower.includes('new york') || addressLower.includes('los angeles')));
        });
        console.log(`여행지 "${destination}" 필터 후: ${filteredListings.length}개`);
      }

      // 게스트 수 필터 (여기서는 간단히 모든 숙소가 게스트를 수용한다고 가정)
      // 실제로는 listing.maxGuests 같은 필드와 비교해야 함
      if (guests) {
        console.log(`게스트 ${guests}명 검색`);
        // TODO: 실제 게스트 수 필터링 로직
      }

      // 날짜 필터 (체크인/체크아웃)
      if (checkIn || checkOut) {
        console.log(`날짜 검색: ${checkIn} ~ ${checkOut}`);
        // TODO: 실제 예약 가능 날짜 필터링 로직
      }

      // 총 25개 표시 (5열 기준)
      const allListings = filteredListings
        .slice(0, 25)
        .map((listing: Listing) => ({
          id: listing.id,
          title: listing.title,
          location: listing.address.split(',')[0] || listing.address,
          imageSrc: listing.images?.[0] || 'https://placehold.co/400x400/FF385C/FFFFFF/png?text=Airbnb',
          price: listing.basePrice,
          rating: Math.random() * 0.5 + 4.5,
          dates: '예약 가능',
          isWished: false,
        }));

      // 서울의 숙소: 15개 (5열 × 3행)
      setJejuListings(allListings.slice(0, 15));
      // 강남구 추천: 10개 (5열 × 2행)
      setOsakaListings(allListings.slice(15, 25));

    } catch (error) {
      console.error('숙소 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-6 py-8 max-w-screen-2xl mx-auto">
        <div className="text-center py-20">로딩 중...</div>
      </div>
    );
  }

  // 검색 결과가 있을 때
  const hasSearchParams = destination || checkIn || checkOut || guests;
  const searchTitle = hasSearchParams 
    ? `검색 결과${destination ? `: ${destination}` : ''}`
    : '서울의 숙소';

  return (
    <div className="px-6 py-8 max-w-screen-2xl mx-auto">
      {/* 검색 정보 표시 */}
      {hasSearchParams && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">검색 조건</h2>
          <div className="flex flex-wrap gap-3 text-sm text-gray-700">
            {destination && <span className="px-3 py-1 bg-white rounded-full">📍 {destination}</span>}
            {checkIn && <span className="px-3 py-1 bg-white rounded-full">📅 {checkIn}</span>}
            {checkOut && <span className="px-3 py-1 bg-white rounded-full">📅 {checkOut}</span>}
            {guests && <span className="px-3 py-1 bg-white rounded-full">👥 게스트 {guests}명</span>}
          </div>
        </div>
      )}

      {/* 검색 결과 또는 기본 숙소 목록 */}
      {hasSearchParams ? (
        // 검색 모드: 단일 섹션
        <section>
          <AccommodationList
            title={searchTitle}
            data={[...jejuListings, ...osakaListings]}
          />
          {jejuListings.length === 0 && osakaListings.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              검색 조건에 맞는 숙소가 없습니다.
            </div>
          )}
        </section>
      ) : (
        // 일반 모드: 2개 섹션
        <>
          {/* 서울의 숙소 - 15개 (5열 × 3행) */}
          {jejuListings.length > 0 && (
            <section className="mb-12">
              <AccommodationList
                title="서울의 숙소"
                data={jejuListings}
              />
            </section>
          )}

          {/* 강남구의 추천 숙소 - 10개 (5열 × 2행) */}
          {osakaListings.length > 0 && (
            <section>
              <AccommodationList
                title="강남구의 추천 숙소"
                data={osakaListings}
              />
            </section>
          )}
        </>
      )}
    </div>
  );
}
