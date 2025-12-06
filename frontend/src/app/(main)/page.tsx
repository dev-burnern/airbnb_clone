'use client';
import { useEffect, useState } from 'react';
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
  const [jejuListings, setJejuListings] = useState<AccommodationData[]>([]);
  const [osakaListings, setOsakaListings] = useState<AccommodationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

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
      
      // 총 25개 표시 (5열 기준)
      const allListings = data
        .slice(0, 25)
        .map((listing: Listing) => ({
          id: listing.id,
          title: listing.title,
          location: listing.address.split(',')[0] || listing.address,
          imageSrc: 'https://via.placeholder.com/400x400/FF385C/FFFFFF?text=Airbnb',
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

  return (
    <div className="px-6 py-8 max-w-screen-2xl mx-auto">
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
    </div>
  );
}
