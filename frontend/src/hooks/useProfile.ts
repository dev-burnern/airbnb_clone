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
        const token = localStorage.getItem('accessToken');
        let targetId = id;
        let userData: any = null;

        // 1. 사용자 기본 정보 가져오기 (/users/me 또는 /users/:id가 있다면 좋겠지만 없으므로 내 정보는 /me로)
        // 만약 id가 주어졌는데 내 아이디와 같다면? 혹은 그냥 공개 프로필 API가 필요한데...
        // 현재는 본인 프로필 조회(/users/me)만 가능하다고 가정하거나, API 구조상 타인 프로필 조회 기능이 제한적일 수 있음.
        // 일단은 '프로필 페이지'가 '나의 프로필'을 보여주는 용도라고 가정하고 진행.

        if (!id || id === 'current_user_id') {
          if (token) {
            const userResponse = await fetch(`${API_BASE_URL}/users/me`, {
              headers: { 'Authorization': `Bearer ${token}` },
            });
            if (userResponse.ok) {
              const json = await userResponse.json();
              userData = json.data || json;
              targetId = userData.id;
            }
          }
        } else {
          // 다른 사람 프로필 조회 API가 있다면 여기서 호출
          // const otherUserResponse = await fetch(`${API_BASE_URL}/users/${id}`);
        }

        // 2. 리뷰 가져오기
        let reviews: Review[] = [];
        if (targetId) {
          try {
            const reviewsResponse = await fetch(`${API_BASE_URL}/reviews/user/${targetId}`, {
              headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            });

            if (reviewsResponse.ok) {
              const json = await reviewsResponse.json();
              const apiReviews: ApiReview[] = (json.data || json) as ApiReview[];
              if (Array.isArray(apiReviews)) {
                reviews = apiReviews.map(transformApiReview);
              }
            }
          } catch (reviewError) {
            console.warn('리뷰를 불러오는데 실패했습니다:', reviewError);
          }
        }

        // 3. 데이터 병합 (API 데이터 우선, 없으면 Mock)
        if (userData) {
          const userProfile = userData.profile || {};
          const createdDate = new Date(userData.createdAt);
          const memberSince = `${createdDate.getFullYear()}년`;

          setProfile({
            name: userData.name || '사용자',
            role: userData.roles?.[0] || '게스트',
            profileImage: userProfile.path || userData.avatarUrl || MOCK_PROFILE.profileImage,
            tripCount: 0, // 아직 API 없음
            reviewCount: reviews.length,
            memberSince: memberSince,
            verified: true,
            reviews: reviews,
            trips: [], // 아직 API 없음
            // 추가 필드 (컴포넌트에서 사용한다면)
            job: userProfile.job,
            location: userProfile.location,
            introduction: userProfile.introduction_text,
            languages: userProfile.language
          } as any); // Type assertion for extra fields
        } else {
          // 로그인 안되어있거나 데이터 없으면 Mock
          setProfile(MOCK_PROFILE);
        }

      } catch (err) {
        console.error('프로필 데이터를 불러오는 데 실패했습니다:', err);
        setError('프로필 데이터를 불러오는 데 실패했습니다.');
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