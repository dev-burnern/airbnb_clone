"use client";
import React, { useState, useEffect } from 'react';
import { X, Heart } from 'lucide-react';
import axios from 'axios';

interface Wishlist {
  id: string;
  name: string;
  listingsCount: number;
  thumbnail?: string;
}

interface AddToWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  onCreateNew: () => void;
  onSuccess?: () => void;
}

const API_BASE_URL = "/backend/api/v1";

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const AddToWishlistModal: React.FC<AddToWishlistModalProps> = ({
  isOpen,
  onClose,
  listingId,
  onCreateNew,
  onSuccess,
}) => {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchWishlists();
    }
  }, [isOpen]);

  const fetchWishlists = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/wishlists`, getAuthHeaders());

      console.log('위시리스트 응답:', response.data);

      // 백엔드 응답: { success: true, data: [...] }
      const dataArray = Array.isArray(response.data) ? response.data : (response.data.data || []);

      const wishlistData = dataArray.map((item: any) => ({
        id: item.id,
        name: item.name || item.title,
        listingsCount: item.listings?.length || 0,
        thumbnail: item.listings?.[0]?.mainImageUrl,
      }));

      setWishlists(wishlistData);
    } catch (error: any) {
      console.error('위시리스트 조회 실패:', error);
      console.error('에러 상세:', error.response?.data);
      // 위시리스트가 없는 경우 빈 배열로 설정
      setWishlists([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async (wishlistId: string) => {
    try {
      console.log('위시리스트에 숙소 추가:', { wishlistId, listingId });

      await axios.post(
        `${API_BASE_URL}/wishlists/${wishlistId}/listings`,
        { listingId },
        getAuthHeaders()
      );

      alert('위시리스트에 추가되었습니다!');

      // 성공 콜백 호출 (하트 색상 변경)
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (error: any) {
      console.error('위시리스트 추가 실패:', error);
      console.error('에러 상세:', error.response?.data);

      if (error.response?.status === 404) {
        alert('숙소를 찾을 수 없습니다.');
      } else {
        alert(`추가에 실패했습니다: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">위시리스트에 저장하기</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 위시리스트 그리드 */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8">로딩 중...</div>
          ) : wishlists.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>저장된 위시리스트가 없습니다.</p>
              <p className="text-sm mt-2">새로운 위시리스트를 만들어보세요!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {wishlists.map((wishlist) => (
                <button
                  key={wishlist.id}
                  onClick={() => handleAddToWishlist(wishlist.id)}
                  className="flex flex-col items-start border rounded-lg overflow-hidden hover:shadow-lg transition"
                >
                  <div className="w-full aspect-square bg-gray-200 relative">
                    {wishlist.thumbnail ? (
                      <img
                        src={wishlist.thumbnail}
                        alt={wishlist.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-white w-full text-left">
                    <h3 className="font-semibold text-sm">{wishlist.name}</h3>
                    <p className="text-xs text-gray-500">
                      저장된 항목 {wishlist.listingsCount}개
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="p-6 border-t">
          <button
            onClick={onCreateNew}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            새로운 위시리스트 만들기
          </button>
        </div>
      </div>
    </div>
  );
};
