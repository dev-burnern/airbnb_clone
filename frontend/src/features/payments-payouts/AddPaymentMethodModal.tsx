// src/features/payments-payouts/AddPaymentMethodModal.tsx

import { useState } from "react";
import { Modal } from "@/shared/ui/Modal"; // Modal 컴포넌트 임포트
import { CreditCard, Lock } from "lucide-react"; // 아이콘 임포트

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cardData: any) => void; // 저장 로직을 위한 콜백
}

export const AddPaymentMethodModal = ({ isOpen, onClose, onSave }: AddPaymentMethodModalProps) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("한국"); // 기본값 한국

  const handleSave = () => {
    // 실제 카드 정보 저장 로직 (API 호출 등)
    onSave({ cardNumber, expiryDate, cvv, zipCode, country });
    onClose(); // 저장 후 모달 닫기
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="카드 상세정보 추가하기">
      <div className="space-y-4">
        {/* 카드 브랜드 로고 */}
        <div className="flex items-center space-x-2 mb-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Mastercard_2019_logo.svg/1200px-Mastercard_2019_logo.svg.png" alt="Mastercard" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/American_Express_logo.svg/1200px-American_Express_logo.svg.png" alt="Amex" className="h-6" />
        </div>

        {/* 카드 번호 */}
        <div className="relative border border-gray-300 rounded-lg p-3 focus-within:border-gray-900">
          <label htmlFor="cardNumber" className="absolute -top-2 left-3 text-xs text-gray-500 bg-white px-1">카드 번호</label>
          <div className="flex items-center">
            <input
              id="cardNumber"
              type="text"
              className="block w-full text-lg border-none focus:ring-0 px-0 pt-2 pb-0"
              placeholder=" "
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            <Lock size={16} className="text-gray-400 ml-2" />
          </div>
        </div>

        <div className="flex space-x-4">
          {/* 만료일 */}
          <div className="relative flex-1 border border-gray-300 rounded-lg p-3 focus-within:border-gray-900">
            <label htmlFor="expiryDate" className="absolute -top-2 left-3 text-xs text-gray-500 bg-white px-1">만료일</label>
            <input
              id="expiryDate"
              type="text"
              className="block w-full text-lg border-none focus:ring-0 px-0 pt-2 pb-0"
              placeholder=" "
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
          {/* CVV */}
          <div className="relative flex-1 border border-gray-300 rounded-lg p-3 focus-within:border-gray-900">
            <label htmlFor="cvv" className="absolute -top-2 left-3 text-xs text-gray-500 bg-white px-1">CVV</label>
            <input
              id="cvv"
              type="text"
              className="block w-full text-lg border-none focus:ring-0 px-0 pt-2 pb-0"
              placeholder=" "
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            />
          </div>
        </div>

        {/* 우편번호 */}
        <div className="relative border border-gray-300 rounded-lg p-3 focus-within:border-gray-900">
          <label htmlFor="zipCode" className="absolute -top-2 left-3 text-xs text-gray-500 bg-white px-1">우편번호</label>
          <input
            id="zipCode"
            type="text"
            className="block w-full text-lg border-none focus:ring-0 px-0 pt-2 pb-0"
            placeholder=" "
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
        </div>

        {/* 국가/지역 */}
        <div className="relative border border-gray-300 rounded-lg focus-within:border-gray-900">
          <label htmlFor="country" className="absolute -top-2 left-3 text-xs text-gray-500 bg-white px-1 z-10">국가/지역</label>
          <div className="relative">
            <select
              id="country"
              className="block w-full text-lg border-none focus:ring-0 appearance-none bg-transparent pt-4 pb-2 px-3"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option>한국</option>
              <option>미국</option>
              <option>일본</option>
              {/* 다른 국가 추가 */}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-6">
        <button onClick={onClose} className="text-gray-900 underline font-medium hover:text-gray-600">
          취소
        </button>
        <button onClick={handleSave} className="px-6 py-3 bg-gray-900 text-white font-medium text-sm rounded-lg hover:bg-gray-700 transition-colors">
          완료
        </button>
      </div>
    </Modal>
  );
};