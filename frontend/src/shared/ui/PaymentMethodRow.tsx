// src/shared/ui/PaymentMethodRow.tsx

import { MoreHorizontal } from 'lucide-react';

interface PaymentMethodRowProps {
  methodType: string;
  lastFourDigits: string;
  expiryDate: string;
}

export const PaymentMethodRow = ({
  methodType,
  lastFourDigits,
  expiryDate,
}: PaymentMethodRowProps) => {
  return (
    <div className="flex justify-between items-center py-6 border-b border-gray-200">
      <div className="flex items-start space-x-3">
        {/* 결제 수단 아이콘: 실제 구현 시 Mastercard SVG 등을 사용 */}
        <div className="w-8 h-8 flex items-center justify-center text-red-500 text-2xl">
            💳
        </div>
        <div>
          <h3 className="text-gray-900 font-medium">{methodType} {lastFourDigits}</h3>
          <p className="text-gray-500 text-sm mt-1">만료일: {expiryDate}</p>
        </div>
      </div>
      
      {/* 더보기 버튼 */}
      <button className="text-gray-500 hover:text-gray-900 p-2 rounded-full transition-colors">
        <MoreHorizontal size={20} />
      </button>
    </div>
  );
};