import React from 'react';
import { AccommodationCard } from '../../entities/accommodation/ui/AccommodationCard';

interface AccommodationItem {
  id: string;
  title: string;
  location: string;
  imageSrc: string;
  price: number;
  rating: number;
  dates: string;
}

interface AccommodationListProps {
  title: string;
  data: AccommodationItem[];
}

export const AccommodationList: React.FC<AccommodationListProps> = ({
  title,
  data,
}) => {
  // 데이터가 없으면 아무것도 렌더링하지 않거나, '결과 없음' 메시지를 표시할 수 있습니다.
  if (!data || data.length === 0) {
    return (
      <section className="mt-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-gray-500">
          이 섹션에 표시할 숙소 정보가 없습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8 px-4 sm:px-6 lg:px-8">
      {/* 목록 제목 */}
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      
      {/* 숙소 목록 그리드 레이아웃 - 5열 고정 */}
      <div className="grid grid-cols-5 gap-x-6 gap-y-8">
        {data.map((item) => (
          // AccommodationItem 타입이 AccommodationCard Props와 일치한다고 가정합니다.
          <AccommodationCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
};