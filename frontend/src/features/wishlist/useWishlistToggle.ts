// src/features/wishlist/useWishlistToggle.ts

"use client";

import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = "http://localhost:3001/api/v1";

// 인증 헤더 생성 함수
const getAuthHeaders = (token: string) => ({ 
    headers: { 
        Authorization: `Bearer ${token}` 
    } 
});

// ID 확보 및 생성 로직
const setupWishlistId = async (token: string, setWishlistId: (id: string) => void) => {
    try {
        // 1. 위시리스트 목록 조회 (GET /api/v1/wishlists)
        const listResponse = await axios.get(`${API_BASE_URL}/wishlists`, getAuthHeaders(token));
        
        let mainId: string | null = null;

        if (listResponse.data && listResponse.data.length > 0) {
            // 2. 존재하는 첫 번째 위시리스트 ID 사용
            const firstWishlist = listResponse.data[0];
            mainId = firstWishlist.id || firstWishlist.data?.id || null;

            if (mainId) {
                console.log("✅ Wishlist ID found (GET):", mainId);
            }
        } 
        
        // 3. 위시리스트가 없으면 새로 생성 (POST /api/v1/wishlists)
        if (!mainId) {
            const createResponse = await axios.post(
                `${API_BASE_URL}/wishlists`, 
                { name: "내 기본 위시리스트" }, 
                getAuthHeaders(token)
            );
            
            const responseData = createResponse.data;
            mainId = responseData.id || responseData.data?.id || null;

            if (mainId) {
                console.log("✅ Wishlist ID created (POST):", mainId);
            } else {
                console.error("❌ Wishlist ID extraction failed from POST response:", responseData);
                alert("위시리스트 ID 생성 후 추출 실패. 백엔드 응답 구조를 확인하세요.");
                return;
            }
        }
        
        // 4. 상태 업데이트
        setWishlistId(mainId);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error(
                `❌ ID Setup Failed: Status ${error.response.status}`, 
                error.response.data
            );
            if (error.response.status === 401) {
                alert("로그인 정보가 만료되었습니다. 다시 로그인해주세요.");
            }
        } else {
            console.error("❌ ID Setup Failed: Network or unknown error", error);
        }
    }
};


export const useWishlistToggle = (initialState: boolean, listingId: string) => {
    const [isWished, setIsWished] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [userMainWishlistId, setUserMainWishlistId] = useState<string | null>(null); 
    const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null; 
    
    console.log("Current listingId:", listingId); 
    console.log("Token Exists in Hook:", !!token);


    useEffect(() => {
        if (token && !userMainWishlistId) {
            console.log("Attempting to setup Wishlist ID.");
            setupWishlistId(token, setUserMainWishlistId);
        }
    }, [token, userMainWishlistId]);


    // 토글 함수
    const toggleWishlist = useCallback(async () => {
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        if (!userMainWishlistId) { 
            alert("위시리스트 정보를 로딩 중입니다. 잠시 후 다시 시도해 주세요.");
            return;
        }

        setIsLoading(true);
        const headers = getAuthHeaders(token).headers;

        try {
            if (isWished) {
                // 제거: DELETE /api/v1/wishlists/{id}/listings/{listingId}
                console.log("DELETE Request URL:", `${API_BASE_URL}/wishlists/${userMainWishlistId}/listings/${listingId}`);
                await axios.delete(
                    `${API_BASE_URL}/wishlists/${userMainWishlistId}/listings/${listingId}`, 
                    { headers }
                );
                setIsWished(false);
                alert("위시리스트에서 숙소가 제거되었습니다.");
            } else {
                // 추가: POST /api/v1/wishlists/{id}/listings
                const payload = { listingId: listingId };
                console.log("POST Payload being sent:", payload); // 🚨 요청 본문 확인
                console.log("POST Request URL:", `${API_BASE_URL}/wishlists/${userMainWishlistId}/listings`);
                
                await axios.post(
                    `${API_BASE_URL}/wishlists/${userMainWishlistId}/listings`,
                    payload, 
                    { headers }
                );
                setIsWished(true);
                alert("위시리스트에 숙소가 추가되었습니다.");
            }
        } catch (error) {
            console.error("위시리스트 토글 실패:", error);
            alert("위시리스트 변경에 실패했습니다. 서버 상태를 확인해주세요.");
        } finally {
            setIsLoading(false);
        }
    }, [isWished, listingId, token, userMainWishlistId]);

    return { isWished, toggleWishlist, isLoading };
};