"use client";


import WishListItem from "@/widgets/wish-list/WishListItem";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api/v1";


export default function WishlistGroupPage() {
  const params = useParams() as { id: string };
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroup = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`${API_BASE_URL}/wishlists/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroup(res.data.data || res.data);
      } catch (e: any) {
        setError("해당 위시리스트를 찾을 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchGroup();
  }, [params.id]);

  if (loading) return <p className="text-center text-gray-500">불러오는 중...</p>;
  if (error || !group)
    return <p className="text-center text-gray-500">{error || "해당 위시리스트를 찾을 수 없습니다."}</p>;

  // listings: [{ id, title, location, rating, images }]
  const listings = group.listings || [];

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">{group.title || group.name}</h1>
      <div>
        {listings.length === 0 ? (
          <p className="text-gray-500">이 위시리스트에 저장된 숙소가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {listings.map((item: any, index: number) => (
              <WishListItem
                key={item.id || index}
                title={item.title || item.name}
                location={item.location || item.address || ""}
                rating={item.rating || 0}
                image={item.mainImageUrl || (Array.isArray(item.images) ? item.images[0] : "/images/placeholder.jpg")}
                listingId={item.id}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
