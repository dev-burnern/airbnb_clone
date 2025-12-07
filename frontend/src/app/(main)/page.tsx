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
  const [listingsByRegion, setListingsByRegion] = useState<{ [key: string]: AccommodationData[] }>({});
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

      // 이미지가 있는 숙소만 필터링 (배열이 존재하고, 유효한 이미지가 하나라도 있는 경우)
      let filteredListings = data.filter((listing: Listing) => {
        if (!listing.images || !Array.isArray(listing.images) || listing.images.length === 0) {
          return false;
        }

        // 유효한 이미지가 하나라도 있는지 확인
        const hasValidImage = listing.images.some((img: string) => {
          if (!img || typeof img !== 'string' || img.trim() === '') {
            return false;
          }
          // 유효한 URL인지 확인 (http, https, data:image로 시작)
          return img.startsWith('http://') ||
            img.startsWith('https://') ||
            img.startsWith('data:image/');
        });

        return hasValidImage;
      });
      console.log(`유효한 이미지가 있는 숙소: ${filteredListings.length}개 (전체 ${data.length}개 중)`);

      // 여행지 필터 (한국: 대구, 부산, 제주, 서울 / 해외: 일본, 필리핀, 미국)
      if (destination) {
        const destLower = destination.toLowerCase();
        filteredListings = filteredListings.filter((listing: Listing) => {
          const addressLower = listing.address.toLowerCase();
          const titleLower = listing.title.toLowerCase();

          // 대구 검색 시 해운대구 제외 (정확한 매칭)
          if (destLower === '대구') {
            // '대구'가 포함되어 있지만 '해운대구'는 아닌 경우만 매칭
            const hasDaegu = addressLower.includes('daegu') ||
              (addressLower.includes('대구') && !addressLower.includes('해운대구')) ||
              titleLower.includes('대구');
            return hasDaegu;
          }

          // 한국 도시 정확한 매칭
          if (destLower === '서울') {
            return addressLower.includes('seoul') || addressLower.includes('서울') || titleLower.includes('서울');
          }
          if (destLower === '부산') {
            return addressLower.includes('busan') || addressLower.includes('부산') || titleLower.includes('부산');
          }
          if (destLower === '제주') {
            return addressLower.includes('jeju') || addressLower.includes('제주') || titleLower.includes('제주');
          }

          // 해외 국가
          if (destLower === '일본') {
            return addressLower.includes('japan') || addressLower.includes('일본') ||
              addressLower.includes('tokyo') || addressLower.includes('osaka') || titleLower.includes('일본');
          }
          if (destLower === '필리핀') {
            return addressLower.includes('philippines') || addressLower.includes('필리핀') ||
              addressLower.includes('manila') || addressLower.includes('boracay') || titleLower.includes('필리핀');
          }
          if (destLower === '미국') {
            return addressLower.includes('usa') || addressLower.includes('america') ||
              addressLower.includes('미국') || addressLower.includes('new york') ||
              addressLower.includes('los angeles') || titleLower.includes('미국');
          }

          // 기타 검색어 - 일반 매칭
          return addressLower.includes(destLower) || titleLower.includes(destLower);
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

      // 숙소 데이터 변환 및 지역별 그룹화
      const allListings = filteredListings
        .map((listing: Listing) => {
          // 유효한 첫 번째 이미지 찾기
          const validImage = listing.images?.find((img: string) =>
            img &&
            typeof img === 'string' &&
            img.trim() !== '' &&
            (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:image/'))
          );

          return {
            id: listing.id,
            title: listing.title,
            location: listing.address.split(',')[0] || listing.address,
            imageSrc: validImage || '',
            price: listing.basePrice,
            rating: Math.random() * 0.5 + 4.5,
            dates: '예약 가능',
            isWished: false,
          };
        })
        // 이미지가 실제로 있는 것만 최종 필터링
        .filter(listing => listing.imageSrc && listing.imageSrc.trim() !== '');

      // 지역별로 그룹화
      const grouped: { [key: string]: AccommodationData[] } = {};

      allListings.forEach((listing) => {
        const location = listing.location.toLowerCase();
        let region = '기타';

        // 한국 도시
        if (location.includes('서울') || location.includes('seoul')) region = '서울';
        else if (location.includes('부산') || location.includes('busan')) region = '부산';
        else if (location.includes('제주') || location.includes('jeju')) region = '제주';
        else if (location.includes('대구') || location.includes('daegu')) region = '대구';
        // 해외
        else if (location.includes('일본') || location.includes('japan') || location.includes('tokyo') || location.includes('osaka')) region = '일본';
        else if (location.includes('필리핀') || location.includes('philippines') || location.includes('manila')) region = '필리핀';
        else if (location.includes('미국') || location.includes('usa') || location.includes('america') || location.includes('new york') || location.includes('los angeles')) region = '미국';

        if (!grouped[region]) grouped[region] = [];
        grouped[region].push(listing);
      });

      setListingsByRegion(grouped);

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
    : null;

  // 검색 모드
  if (hasSearchParams) {
    const allListings = Object.values(listingsByRegion).flat();

    return (
      <div className="px-6 py-8 max-w-screen-2xl mx-auto">
        {/* 검색 조건 표시 - 에어비앤비 스타일 */}
        <div className="mb-8 flex items-center justify-center gap-2 text-sm">
          <span className="font-semibold text-gray-900">
            {destination ? `${destination} 숙소 검색 계속하기` : '숙소 검색 계속하기'}
          </span>
          {(checkIn || checkOut || guests) && <span className="text-gray-400">|</span>}
          {checkIn && checkOut && (
            <>
              <span className="text-gray-700">{checkIn}~{checkOut}</span>
              {guests && <span className="text-gray-400">|</span>}
            </>
          )}
          {guests && (
            <>
              <span className="text-gray-700">게스트 {guests}명</span>
            </>
          )}
          <button className="text-gray-900 hover:underline flex items-center gap-1">
          </button>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-200 mb-8"></div>

        {/* 검색 결과 */}
        <section>
          <AccommodationList
            title={searchTitle || '검색 결과'}
            data={allListings}
          />
          {allListings.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              검색 조건에 맞는 숙소가 없습니다.
            </div>
          )}
        </section>
      </div>
    );
  }

  // 일반 모드: 지역별로 표시
  const regions = Object.keys(listingsByRegion).sort((a, b) => {
    // 한국 도시를 먼저 표시
    const koreanCities = ['서울', '부산', '제주', '대구'];
    const aIndex = koreanCities.indexOf(a);
    const bIndex = koreanCities.indexOf(b);

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });

  // 지역별 표시 개수 제한 (1행 = 5개)
  const limitedListings: { [key: string]: AccommodationData[] } = {};
  const limitToOneRow = ['기타', '일본', '제주', '미국']; // 1행만 표시할 지역

  regions.forEach(region => {
    const listings = listingsByRegion[region];
    if (limitToOneRow.includes(region)) {
      // 1행(5개)만 표시
      limitedListings[region] = listings.slice(0, 5);
    } else {
      // 전체 표시
      limitedListings[region] = listings;
    }
  });

  return (
    <div className="px-6 py-8 max-w-screen-2xl mx-auto">
      {regions.map((region, index) => (
        limitedListings[region] && limitedListings[region].length > 0 && (
          <section key={region} className={index > 0 ? 'mt-12' : ''}>
            <AccommodationList
              title={`${region}의 숙소`}
              data={limitedListings[region]}
            />
          </section>
        )
      ))}

      {regions.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          표시할 숙소가 없습니다.
        </div>
      )}
    </div>
  );
}
