import { useState, useEffect } from 'react';

// --- 타입 정의 ---
export interface Review {
  reviewerName: string;
  location: string;
  date: string;
  comment: string;
  reviewerImage: string;
}

export interface Trip {
  year: number;
  listingName: string;
  dates: string;
  image: string;
}

export interface ProfileData {
  name: string;
  role: string;
  profileImage: string;
  tripCount: number;
  reviewCount: number;
  memberSince: string;
  verified: boolean;
  reviews: Review[];
  trips: Trip[];
}

// --- 목업 데이터 (useProfile 훅에서 사용) ---
const MOCK_PROFILE: ProfileData = {
  name: '민서',
  role: '게스트',
  // 프로필 이미지 URL을 NavItem에서 사용하기 위해 실제 URL이나 플레이스홀더를 사용합니다.
  profileImage: 'https://placehold.co/100x100/FF5A5F/ffffff?text=민',
  tripCount: 1,
  reviewCount: 1,
  memberSince: '3년',
  verified: true,
  reviews: [
    {
      reviewerName: '호세',
      location: '대구, 한국',
      date: '2023년 1월',
      comment: '민서님은 친절하고 깔끔하신 게스트분이셨습니다. 하우스룰도 잘 지켜주셨구요. 혹시 저희 숙소에 다시 방문해 주신다면 언제든 환영해 드리겠습니다! ^^',
      reviewerImage: 'https://placehold.co/40x40/9CA3AF/ffffff?text=H',
    },
  ],
  trips: [
    {
      year: 2023,
      listingName: '북구',
      dates: '2023년 1월 4일 - 5일',
      image: 'https://placehold.co/300x200/F3F4F6/9CA3AF?text=Previous+Trip+Image',
    },
  ],
};

// --- 커스텀 훅 정의 ---
export const useProfile = (id: string | null) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 실제 Firebase 또는 API 호출 로직이 들어갈 부분
    setLoading(true);
    setError(null);

    const fetchMockData = () => {
      return new Promise<ProfileData>((resolve) => {
        setTimeout(() => {
          resolve(MOCK_PROFILE);
        }, 500); // 로딩 시뮬레이션
      });
    };

    fetchMockData().then(data => {
      setProfile(data);
    }).catch(err => {
      setError('프로필 데이터를 불러오는 데 실패했습니다.');
    }).finally(() => {
      setLoading(false);
    });
    
  }, [id]);

  return { profile, loading, error };
};