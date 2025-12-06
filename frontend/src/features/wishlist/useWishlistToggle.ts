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

// 🚀 ID 확보 및 생성 로직 (ID 추출 로직 최종 강화 및 디버그 로그 추가)
const setupWishlistId = async (token: string, setWishlistId: (id: string) => void) => {
    try {
        // 1. 위시리스트 목록 조회 (GET /api/v1/wishlists)
        const listResponse = await axios.get(`${API_BASE_URL}/wishlists`, getAuthHeaders(token));
        
        let mainId: string | null = null;

        if (listResponse.data && listResponse.data.length > 0) {
            const firstWishlist = listResponse.data[0];
            
            // GET 응답에서 ID 추출
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
            
            // 🚨🚨 ID 추출 로직 최종 강화 🚨🚨
            // responseData.id, responseData.data?.id 등을 모두 시도
            let extractedId = responseData.id || responseData.data?.id || responseData[0]?.id;

            // 응답이 { data: { id: "..." } } 같은 구조일 때를 대비하여 재확인
            if (typeof extractedId !== 'string' && responseData.data && responseData.data.id) {
                extractedId = responseData.data.id;
            }
            
            mainId = extractedId || null;

            if (mainId) {
                console.log("✅ Wishlist ID created (POST):", mainId);
            } else {
                // ID 추출 실패 시, 상세 응답 데이터를 콘솔에 출력
                console.error(
                    "❌ Wishlist ID extraction failed from POST response.", 
                    { 
                        responseStatus: createResponse.status, 
                        fullResponseData: responseData // 전체 데이터 출력
                    }
                );
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

        // 🚨 userMainWishlistId가 null이면 alert이 뜹니다.
        if (!userMainWishlistId) { 
            alert("위시리스트 정보를 로딩 중입니다. 잠시 후 다시 시도해 주세요.");
            return;
        }

        setIsLoading(true);
        const headers = getAuthHeaders(token).headers;
        

        try {
            if (isWished) {
                // 제거: DELETE /api/v1/wishlists/{id}/listings/{listingId}
                const deleteUrl = `${API_BASE_URL}/wishlists/${userMainWishlistId}/listings/${listingId}`;
                console.log("DELETE Request URL:", deleteUrl);
                
                await axios.delete(
                    deleteUrl, 
                    { headers } 
                );
                
                setIsWished(false);
                alert("위시리스트에서 숙소가 제거되었습니다.");
            } else {
                // 추가: POST /api/v1/wishlists/{id}/listings
                const postUrl = `${API_BASE_URL}/wishlists/${userMainWishlistId}/listings`;
                const payload = { listingId: listingId };
                
                console.log("POST Request URL:", postUrl);
                console.log("POST Payload being sent:", payload); 
                
                await axios.post(
                    postUrl,
                    payload, 
                    { headers }
                );
                
                setIsWished(true);
                alert("위시리스트에 숙소가 추가되었습니다.");
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // 에러 응답 상세 로그 추가
                console.error(
                    `❌ API Request Failed: Status ${error.response.status}`, 
                    error.response.data
                );
            } else {
                console.error("❌ 위시리스트 토글 실패:", error);
            }
            alert("위시리스트 변경에 실패했습니다. 서버 상태를 확인해주세요.");
        } finally {
            setIsLoading(false);
        }
    }, [isWished, listingId, token, userMainWishlistId]);

    return { isWished, toggleWishlist, isLoading };
};