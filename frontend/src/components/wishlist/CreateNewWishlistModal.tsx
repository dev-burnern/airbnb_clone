"use client";
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

interface CreateNewWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  listingId: string;
}

const API_BASE_URL = "http://localhost:3001/api/v1";

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const CreateNewWishlistModal: React.FC<CreateNewWishlistModalProps> = ({
  isOpen,
  onClose,
  onBack,
  listingId,
}) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);
      
      console.log('위시리스트 생성 시작:', name.trim());
      
      // 1. 새 위시리스트 생성
      const createResponse = await axios.post(
        `${API_BASE_URL}/wishlists`,
        { name: name.trim() },
        getAuthHeaders()
      );

      console.log('생성 응답:', createResponse.data);

      const newWishlistId = createResponse.data?.id || createResponse.data?.data?.id;

      if (!newWishlistId) {
        console.error('위시리스트 ID 추출 실패. 응답:', createResponse.data);
        throw new Error('위시리스트 ID를 가져올 수 없습니다.');
      }

      console.log('위시리스트 ID:', newWishlistId);
      console.log('숙소 추가 시작:', listingId);

      // 2. 숙소 추가
      const addResponse = await axios.post(
        `${API_BASE_URL}/wishlists/${newWishlistId}/listings`,
        { listingId },
        getAuthHeaders()
      );

      console.log('숙소 추가 응답:', addResponse.data);

      alert('위시리스트가 생성되고 숙소가 추가되었습니다!');
      setName('');
      onClose();
    } catch (error: any) {
      console.error('위시리스트 생성 실패:', error);
      console.error('에러 상세:', error.response?.data);
      alert(`생성에 실패했습니다: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-center gap-4 p-6 border-b">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold">위시리스트 만들기</h2>
        </div>

        {/* 입력 영역 */}
        <div className="p-6">
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 50))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            maxLength={50}
          />
          <p className="text-sm text-gray-500 mt-2">
            {name.length}/50자
          </p>
        </div>

        {/* 하단 버튼 */}
        <div className="flex items-center justify-between p-6 border-t">
          <button
            onClick={onBack}
            className="px-6 py-2 text-gray-700 hover:underline"
          >
            취소
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim() || loading}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              name.trim() && !loading
                ? 'bg-[#FF385C] text-white hover:bg-[#E31C5F]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? '생성 중...' : '새로 만들기'}
          </button>
        </div>
      </div>
    </div>
  );
};
