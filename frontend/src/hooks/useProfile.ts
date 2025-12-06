import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

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

// API 응답 타입
interface ApiReview {
  id: string;
  content: string;
  rating: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  listing?: {
    id: string;
    title: string;
    address: string;
  };
}

// API 응답을 프론트엔드 형식으로 변환
const transformApiReview = (apiReview: ApiReview): Review => {
  const createdDate = new Date(apiReview.createdAt);
  const dateString = `${createdDate.getFullYear()}년 ${createdDate.getMonth() + 1}월`;

  return {
    reviewerName: apiReview.author?.name || '익명',
    location: apiReview.listing?.address || '',
    date: dateString,
    comment: apiReview.content,
    reviewerImage: apiReview.author?.avatarUrl || `https://placehold.co/40x40/9CA3AF/ffffff?text=${(apiReview.author?.name || '?').charAt(0)}`,
  };
};

// --- 목업 데이터 (API 실패시 폴백) ---
const MOCK_PROFILE: ProfileData = {
  name: '민서',
  role: '게스트',
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
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 사용자 정보와 리뷰를 병렬로 가져옴
        const token = localStorage.getItem('access_token');

        // 리뷰 API 호출 (사용자 ID가 있는 경우)
        let reviews: Review[] = [];
        if (id) {
          try {
            const reviewsResponse = await fetch(`${API_BASE_URL}/reviews/user/${id}`, {
              headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            });

            if (reviewsResponse.ok) {
              const apiReviews: ApiReview[] = await reviewsResponse.json();
              reviews = apiReviews.map(transformApiReview);
            }
          } catch (reviewError) {
            console.warn('리뷰를 불러오는데 실패했습니다:', reviewError);
          }
        }

        // 프로필 데이터 구성 (API 데이터 + 기본값)
        const profileData: ProfileData = {
          ...MOCK_PROFILE,
          reviews: reviews.length > 0 ? reviews : MOCK_PROFILE.reviews,
          reviewCount: reviews.length > 0 ? reviews.length : MOCK_PROFILE.reviewCount,
        };

        setProfile(profileData);
      } catch (err) {
        console.error('프로필 데이터를 불러오는 데 실패했습니다:', err);
        setError('프로필 데이터를 불러오는 데 실패했습니다.');
        // 오류 시 목업 데이터 사용
        setProfile(MOCK_PROFILE);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  return { profile, loading, error };
};

// --- 리뷰 관련 유틸리티 함수들 ---
export const reviewApi = {
  // 내 리뷰 목록 조회
  async getMyReviews(): Promise<ApiReview[]> {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('로그인이 필요합니다.');

    const response = await fetch(`${API_BASE_URL}/reviews`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('리뷰를 불러오는데 실패했습니다.');
    return response.json();
  },

  // 숙소별 리뷰 조회
  async getListingReviews(listingId: string): Promise<ApiReview[]> {
    const response = await fetch(`${API_BASE_URL}/reviews/listing/${listingId}`);
    if (!response.ok) throw new Error('리뷰를 불러오는데 실패했습니다.');
    return response.json();
  },

  // 숙소 평균 평점 조회
  async getListingRating(listingId: string): Promise<{ average: number; count: number }> {
    const response = await fetch(`${API_BASE_URL}/reviews/listing/${listingId}/rating`);
    if (!response.ok) throw new Error('평점을 불러오는데 실패했습니다.');
    return response.json();
  },

  // 리뷰 작성
  async createReview(data: { listingId: string; content: string; rating: number }): Promise<ApiReview> {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('로그인이 필요합니다.');

    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('리뷰 작성에 실패했습니다.');
    return response.json();
  },

  // 리뷰 수정
  async updateReview(id: string, data: { content?: string; rating?: number }): Promise<ApiReview> {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('로그인이 필요합니다.');

    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('리뷰 수정에 실패했습니다.');
    return response.json();
  },

  // 리뷰 삭제
  async deleteReview(id: string): Promise<void> {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('로그인이 필요합니다.');

    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('리뷰 삭제에 실패했습니다.');
  },
};