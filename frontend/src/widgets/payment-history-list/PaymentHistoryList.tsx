// src/widgets/payment-history-list/PaymentHistoryList.tsx
"use client"; // doc

import Link from "next/link";
import { ChevronRight } from "lucide-react";

// 개별 결제 완료 내역 컴포넌트
interface PaymentItemProps {
  date: string;
  cardInfo: string;
  period: string;
  amount: string;
  currency: string;
  imageUrl: string;
}

const PaymentItem = ({ date, cardInfo, period, amount, currency, imageUrl }: PaymentItemProps) => (
  <Link 
    href="#" 
    className="flex justify-between items-center py-4 border-b border-gray-200 hover:bg-gray-50 -mx-4 px-4 rounded-lg transition-colors"
  >
    <div className="flex items-start space-x-4">
      <img src={imageUrl} alt="숙소 이미지" className="w-12 h-12 object-cover rounded-md flex-shrink-0" />
      <div>
        <h4 className="text-gray-900 font-medium text-sm">결제 완료 {date}</h4>
        <p className="text-gray-500 text-sm mt-1">{cardInfo}</p>
        <p className="text-gray-500 text-xs">{period}</p>
      </div>
    </div>
    <div className="flex items-center space-x-1 text-gray-900 font-medium text-sm">
      <span>{amount}</span>
      <span className="text-gray-500 text-xs">{currency}</span>
      <ChevronRight size={16} className="text-gray-500 ml-1" />
    </div>
  </Link>
);


export const PaymentHistoryList = () => {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        {/* 뒤로 가기 버튼이나 헤더는 레이아웃에 따라 달라질 수 있으나, 여기서는 콘텐츠만 구현 */}
        <h1 className="text-3xl font-bold text-gray-900">결제 내역</h1>
      </div>

      <div className="flex space-x-10">
        {/* 왼쪽 섹션: 결제 목록 */}
        <div className="flex-1 min-w-0 pr-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">완료</h2>
          
          <div className="space-y-4">
            <h3 className="text-gray-900 font-medium mt-6">2022</h3>
            
            <PaymentItem
              date="12월 26일"
              cardInfo="Mastercard 2371"
              period="Buk-gu · 1월 4일~1월 5일"
              amount="₩207,953"
              currency="KRW"
              imageUrl="https://source.unsplash.com/random/50x50/?house,travel" // 임시 이미지 URL
            />
            {/* 추가 항목들 */}
          </div>
        </div>

        {/* 오른쪽 섹션: 도움말 */}
        <div className="w-64 flex-shrink-0">
          <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
            <h3 className="text-gray-900 font-bold mb-3">도움이 필요하세요?</h3>
            <div className="space-y-2">
              <Link href="#" className="flex justify-between items-center text-gray-700 text-sm hover:underline">
                <span>분할 결제는 어떤 방식으로 운영되나요?</span>
                <ChevronRight size={14} />
              </Link>
              <Link href="#" className="flex justify-between items-center text-gray-700 text-sm hover:underline">
                <span>장기 숙박 요금은 어떻게 결제하나요?</span>
                <ChevronRight size={14} />
              </Link>
              <Link href="#" className="flex justify-between items-center text-gray-700 text-sm hover:underline">
                <span>결제 내역은 어디에서 확인할 수 있나요?</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};