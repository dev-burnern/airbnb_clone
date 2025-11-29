// src/features/payments-payouts/PaymentSection.tsx (수정)

import { useState } from "react";
import Link from "next/link"; // Link 임포트
import { PaymentMethodRow } from "@/shared/ui/PaymentMethodRow";
import { AddPaymentMethodModal } from "./AddPaymentMethodModal";

export const PaymentSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSaveCard = (cardData: any) => {
    console.log("새 카드 정보 저장:", cardData);
  };

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">결제 내역</h2>
        <p className="text-gray-500 text-sm mb-4">모든 결제 및 환불 내역을 확인하세요.</p>
        
        {/* 결제 관리하기 버튼을 Link 컴포넌트로 변경 */}
        <Link 
          href="/account/payments-payouts/history"
          className="inline-block px-6 py-3 bg-gray-900 text-white font-medium text-sm rounded-lg hover:bg-gray-700 transition-colors"
        >
          결제 관리하기
        </Link>
      </section>
      {/* ... (이하 나머지 PaymentSection 코드는 동일) */}
      
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">결제 수단</h2>
        <p className="text-gray-500 text-sm mb-4">에어비앤비의 안전한 결제 시스템을 이용해 결제 수단을 추가하고 관리하세요.</p>
        
        <PaymentMethodRow
          methodType="Mastercard"
          lastFourDigits="2371"
          expiryDate="01/2024"
        />

        <div className="pt-6">
          <button 
            onClick={handleOpenModal}
            className="px-6 py-3 bg-gray-900 text-white font-medium text-sm rounded-lg hover:bg-gray-700 transition-colors"
          >
            결제 수단 추가
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">에어비앤비 기프트 크레딧</h2>
        
        <button className="px-6 py-3 bg-gray-900 text-white font-medium text-sm rounded-lg hover:bg-gray-700 transition-colors">
          기프트 카드 추가
        </button>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">쿠폰</h2>
        
        <div className="flex justify-between items-center py-6 border-b border-gray-200">
            <h3 className="text-gray-900 font-medium">쿠폰</h3>
            <p className="text-gray-900 font-medium">0</p>
        </div>
        
        <div className="pt-6">
          <button className="px-6 py-3 bg-gray-900 text-white font-medium text-sm rounded-lg hover:bg-gray-700 transition-colors">
            쿠폰 추가
          </button>
        </div>
        
        <div className="mt-8 bg-pink-50 border border-pink-200 p-4 rounded-lg flex items-start space-x-3">
            <div className="text-pink-700 text-2xl mt-0">
                💰
            </div>
            <div>
                <h3 className="text-sm font-bold text-pink-800">에어비앤비를 통해서만 결제하세요</h3>
                <p className="text-sm text-pink-800 mt-1">
                    에어비앤비의 서비스 약관, 환불 정책 및 기타 안전장치의 보호를 받으려면 항상 에어비앤비를 통해 결제 수단 카니나 커뮤니케이션을 진행하시기 바랍니다. 
                    <button className="underline font-medium hover:text-pink-600">
                        자세히 알아보기
                    </button>
                </p>
            </div>
        </div>
      </section>

      <AddPaymentMethodModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSaveCard} 
      />
    </div>
  );
};