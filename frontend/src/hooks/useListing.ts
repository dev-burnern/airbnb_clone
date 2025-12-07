
import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface ListingDetail {
    id: string;
    title: string;
    description: string;
    address: string;
    price: number;
    basePrice: number;
    images: string[];
    host: {
        id: string;
        name: string;
        avatarUrl: string;
        isSuperhost?: boolean;
        createdAt?: string;
    };
    amenities: string[];
    latitude: number;
    longitude: number;
    rating?: number;
    reviewCount?: number;
    maxGuests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    roomType: string;
}

export const useListing = (id: string | null) => {
    const [listing, setListing] = useState<ListingDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchListing = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/listings/${id}`);
                if (!response.ok) {
                    throw new Error('숙소 정보를 불러오는데 실패했습니다.');
                }
                const json = await response.json();
                // Unwrap global interceptor response if needed
                const data = json.success && json.data ? json.data : json;

                setListing(data);
            } catch (err: any) {
                console.error('Error fetching listing:', err);
                setError(err.message || '오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [id]);

    return { listing, loading, error };
};
