"use client";

import React from "react";
import { Wifi, Tv, ChefHat, WashingMachine, Car, Wind, Briefcase, Waves, Bath, Fence, Flame, Coffee, Dumbbell, Mountain, Snowflake, Umbrella } from "lucide-react";

interface Step9AmenitiesProps {
  formData: {
    popularAmenities: string[];
    standoutAmenities: string[];
  };
  onUpdate: (data: any) => void;
}

const Step9Amenities: React.FC<Step9AmenitiesProps> = ({
  formData,
  onUpdate,
}) => {
  const popularAmenities = [
    { id: "wifi", label: "와이파이", icon: Wifi },
    { id: "tv", label: "TV", icon: Tv },
    { id: "kitchen", label: "주방", icon: ChefHat },
    { id: "washer", label: "세탁기", icon: WashingMachine },
    { id: "free_parking_premises", label: "건물 내 무료 주차", icon: Car },
    { id: "free_parking_property", label: "건물 부지 내 무료 주차", icon: Car },
    { id: "air_conditioning", label: "에어컨", icon: Wind },
    { id: "workspace", label: "업무 전용 공간", icon: Briefcase },
  ];

  const standoutAmenities = [
    { id: "pool", label: "수영장", icon: Waves },
    { id: "hot_tub", label: "대형 욕조", icon: Bath },
    { id: "patio", label: "파티오", icon: Umbrella },
    { id: "bbq", label: "바비큐 그릴", icon: Flame },
    { id: "outdoor_dining", label: "야외 식사 공간", icon: Coffee },
    { id: "fire_pit", label: "화로", icon: Flame },
    { id: "pool_table", label: "당구대", icon: Coffee },
    { id: "indoor_fireplace", label: "실내 벽난로", icon: Flame },
    { id: "piano", label: "피아노", icon: Coffee },
    { id: "exercise_equipment", label: "운동 기구", icon: Dumbbell },
    { id: "lake_access", label: "호수로 연결", icon: Waves },
    { id: "beach_access", label: "해변으로 연결", icon: Umbrella },
    { id: "ski_in_out", label: "스키 타고 출입", icon: Snowflake },
    { id: "outdoor_shower", label: "야외 샤워 시설", icon: Mountain },
  ];

  const toggleAmenity = (type: "popular" | "standout", id: string) => {
    const key = type === "popular" ? "popularAmenities" : "standoutAmenities";
    const current = formData[key];
    
    if (current.includes(id)) {
      onUpdate({
        ...formData,
        [key]: current.filter((item: string) => item !== id),
      });
    } else {
      onUpdate({
        ...formData,
        [key]: [...current, id],
      });
    }
  };

  return (
    <div className="flex flex-col h-full px-8 py-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        <h1 className="text-4xl font-semibold mb-4">
          숙소 편의시설 정보를 추가하세요
        </h1>
        <p className="text-gray-600 mb-12">
          여기에 추가하려는 편의시설이 보이지 않더라도 걱정하지 마세요! 숙소를
          등록한 후에 편의시설을 추가할 수 있습니다.
        </p>

        {/* Popular Amenities */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            다음 인기 편의시설이 있나요?
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {popularAmenities.map((amenity) => {
              const Icon = amenity.icon;
              const isSelected = formData.popularAmenities.includes(amenity.id);
              return (
                <button
                  key={amenity.id}
                  onClick={() => toggleAmenity("popular", amenity.id)}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 transition ${
                    isSelected
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-300 hover:border-gray-900"
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-lg">{amenity.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Standout Amenities */}
        <div className="pb-24">
          <h2 className="text-2xl font-semibold mb-6">
            특별히 내세울 만한 편의시설이 있나요?
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {standoutAmenities.map((amenity) => {
              const Icon = amenity.icon;
              const isSelected = formData.standoutAmenities.includes(amenity.id);
              return (
                <button
                  key={amenity.id}
                  onClick={() => toggleAmenity("standout", amenity.id)}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 transition ${
                    isSelected
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-300 hover:border-gray-900"
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-lg">{amenity.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step9Amenities;
