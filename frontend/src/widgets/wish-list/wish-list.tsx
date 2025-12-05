"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

type WishlistGroup = {
  id: string; 
  title: string;
  subtitle: string; 
  images: string[];
};

const API_BASE_URL = "http://localhost:3001/api/v1"; 

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken"); 
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// 1. 위시리스트 목록을 가져오는 API
const fetchWishlists = async (): Promise<WishlistGroup[]> => {
  try {
    // GET /api/v1/wishlists 호출
    const response = await axios.get(`${API_BASE_URL}/wishlists`, getAuthHeaders());
    
    return response.data.map((item: any) => ({
      id: item.id,
      title: item.title || item.name, 
      subtitle: `${item.listings?.length || 0}개 저장된 항목`, 
      images: item.listings?.slice(0, 4).map((listing: any) => listing.mainImageUrl || "/images/placeholder.jpg") || [],
    })) as WishlistGroup[];

  } catch (error) {
    console.error("위시리스트 목록 조회 실패:", error);
    alert("위시리스트 목록을 가져오는 데 실패했습니다.");
    return [];
  }
};

// 2. 위시리스트를 삭제하는 API
const deleteWishlist = async (id: string) => {
  try {
    // DELETE /api/v1/wishlists/{id} 호출
    await axios.delete(`${API_BASE_URL}/wishlists/${id}`, getAuthHeaders());
    return true;
  } catch (error) {
    console.error(`위시리스트 ${id} 삭제 실패:`, error);
    alert("위시리스트 삭제에 실패했습니다.");
    return false;
  }
};

export default function Wishlist() {
  const [wishlistGroups, setWishlistGroups] = useState<WishlistGroup[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<WishlistGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadWishlists = async () => {
    setIsLoading(true);
    const data = await fetchWishlists();
    setWishlistGroups(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadWishlists();
  }, []);

  // 삭제 확인 모달의 '삭제' 버튼 클릭 핸들러
  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      const success = await deleteWishlist(deleteTarget.id);
      if (success) {
        setWishlistGroups(prev => prev.filter(group => group.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-500">위시리스트를 불러오는 중...</p>;
  }

  return (
    <>
      <div className="space-y-10">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {wishlistGroups.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">아직 저장된 위시리스트가 없습니다.</p>
          ) : (
            wishlistGroups.map((group) => (
              // Link의 href를 string 타입인 group.id에 맞게 수정
              <Link key={group.id} href={`/wishlist/${group.id}`}>
                <div className="cursor-pointer relative">
                  
                  {/* 삭제 버튼 */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDeleteTarget(group);
                    }}
                    className="absolute top-3 left-3 bg-white/80 hover:bg-white text-gray-700 font-semibold w-7 h-7 rounded-full shadow z-10 flex items-center justify-center transition"
                  >
                    ×
                  </button>

                  {/* 이미지 표시 로직 (기존과 동일) */}
                  {group.images.length >= 4 ? (
                    <div className="rounded-3xl overflow-hidden w-full h-64 grid grid-cols-2 grid-rows-2 bg-gray-200">
                      {group.images.slice(0, 4).map((img, index) => (
                        <div key={index} className="relative w-full h-full">
                          <Image src={img} alt={group.title} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-3xl overflow-hidden w-full h-64 bg-gray-200 relative">
                      {group.images[0] && (
                          <Image
                            src={group.images[0]}
                            alt={group.title}
                            fill
                            className="object-cover"
                          />
                      )}
                    </div>
                  )}

                  {/* 텍스트 */}
                  <div className="mt-3">
                    <p className="text-[17px] font-semibold">{group.title}</p>
                    <p className="text-sm text-gray-500">{group.subtitle}</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[350px] shadow-xl relative">

            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
              onClick={() => setDeleteTarget(null)}
            >
              ×
            </button>

            <h2 className="text-lg font-semibold mb-2">이 위시리스트를 삭제하시겠어요?</h2>
            <p className="text-gray-500 mb-6">
              &quot;{deleteTarget.title}&quot; 위시리스트가 영구적으로 삭제됩니다.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600"
              >
                취소
              </button>
              <button 
                onClick={handleDeleteConfirm} 
                className="px-4 py-2 rounded-lg bg-black text-white"
              >
                삭제
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}