"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Step1HostingType from "./steps/Step1HostingType";
import Step2GettingStarted from "./steps/Step2GettingStarted";
import Step3PropertyType from "./steps/Step3PropertyType";
import Step4GuestSpace from "./steps/Step4GuestSpace";
import Step5Address from "./steps/Step5Address";
import Step6MapConfirm from "./steps/Step6MapConfirm";
import Step7BasicInfo from "./steps/Step7BasicInfo";
import Step8Showcase from "./steps/Step8Showcase";
import Step9Amenities from "./steps/Step9Amenities";
import Step10Safety from "./steps/Step10Safety";
import Step11PhotosIntro from "./steps/Step11PhotosIntro";
import Step12PhotoUpload from "./steps/Step12PhotoUpload";
import Step14PropertyName from "./steps/Step14PropertyName";
import Step15Description from "./steps/Step15Description";
import Step16Highlights from "./steps/Step16Highlights";
import Step17BookingSettings from "./steps/Step17BookingSettings";
import Step18CompleteIntro from "./steps/Step18CompleteIntro";
import Step19WeekendPricing from "./steps/Step19WeekendPricing";
import Step20Discounts from "./steps/Step20Discounts";
import Step21FinalDetails from "./steps/Step21FinalDetails";
import { useRouter } from "next/navigation";

interface HostRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HostRegistrationModal({
  isOpen,
  onClose,
}: HostRegistrationModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    hostingType: "",
    propertyType: "",
    guestSpace: "",
    address: {
      country: "한국 - KR",
      state: "",
      city: "",
      district: "",
      street: "",
      detail: "",
      postalCode: "",
    },
    showExactLocation: true,
    // Step 7
    guests: 4,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    // Step 9
    popularAmenities: [] as string[],
    standoutAmenities: [] as string[],
    // Step 10
    safetyItems: [] as string[],
    // Step 12-13
    photos: [] as string[],
    // Step 14
    propertyName: "",
    // Step 15
    propertyDescription: "",
    // Step 16
    highlights: [] as string[],
    // Step 17
    bookingSetting: "",
    // Step 19
    basePrice: 64115,
    weekendPremium: 0,
    // Step 20
    discounts: [] as string[],
    // Step 21
    hostAddress: {
      country: "한국 - KR",
      state: "",
      city: "",
      district: "",
      street: "",
      detail: "",
      postalCode: "",
    },
  });

  if (!isOpen) return null;

  const handleNext = () => {
    // Step 11에서 Step 12로 넘어갈 때 (사진 추가하기 버튼)
    if (step === 11) {
      setStep(12);
      return;
    }
    
    // Step 12에서 Step 14로 건너뛰기 (Step 13은 Step 12에 통합)
    if (step === 12) {
      setStep(14);
      return;
    }
    
    if (step < 21) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateListing = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // JWT 토큰 가져오기
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      // 백엔드 API 스키마에 맞게 데이터 변환
      const listingPayload = {
        title: formData.propertyName,
        description: formData.propertyDescription,
        type: formData.propertyType,
        address: `${formData.address.state} ${formData.address.city} ${formData.address.district} ${formData.address.street} ${formData.address.detail}`.trim(),
        latitude: 37.5665, // TODO: 실제 주소로부터 좌표 변환 필요
        longitude: 126.9780,
        images: formData.photos,
        amenities: [...formData.popularAmenities, ...formData.standoutAmenities],
        maxGuests: formData.guests,
        basePrice: formData.basePrice,
        weekendPrice: formData.basePrice + (formData.basePrice * formData.weekendPremium / 100),
        smartPricingEnabled: false,
        priceConfig: {
          weekday: formData.basePrice,
          weekend: formData.basePrice + (formData.basePrice * formData.weekendPremium / 100),
          extraGuest: 0,
        },
      };

      console.log('Sending listing data:', listingPayload);

      // 백엔드 API 호출
      const response = await fetch('http://localhost:3001/api/v1/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(listingPayload),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
        }
        const errorData = await response.json().catch(() => ({ message: '알 수 없는 오류' }));
        console.error('Backend error response:', response.status, errorData);
        throw new Error(errorData.message || errorData.error || `숙소 등록에 실패했습니다 (${response.status})`);
      }

      const result = await response.json();
      const newListingId = result.data?.id || result.id;

      console.log('Listing created successfully:', newListingId);
      
      // localStorage에 hasListing 플래그 설정
      localStorage.setItem("hasListing", "true");
      
      // 리스팅 에디터 페이지로 이동
      router.push(`/host/listings/${newListingId}`);
      
      // 모달 닫기
      onClose();
    } catch (error: any) {
      console.error("Failed to create listing:", error);
      setError(error.message || '숙소 등록 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.hostingType === "숙소";
      case 2:
        return true; // 안내 단계는 항상 진행 가능
      case 3:
        return formData.propertyType !== "";
      case 4:
        return formData.guestSpace !== "";
      case 5:
        return (
          formData.address.state !== "" && formData.address.district !== ""
        );
      case 6:
        return true;
      case 7:
        return true; // 기본값이 설정되어 있으므로 항상 진행 가능
      case 8:
        return true; // 안내 단계
      case 9:
        return true; // 편의시설은 선택 사항
      case 10:
        return true; // 안전 물품은 선택 사항
      case 11:
        return true; // 사진 추가 안내 단계
      case 12:
        return formData.photos.length >= 1; // 커버 사진만 있어도 진행 가능
      case 14:
        return formData.propertyName.trim() !== "";
      case 15:
        return formData.propertyDescription.trim() !== "";
      case 16:
        return formData.highlights.length > 0; // 최소 1개 선택
      case 17:
        return formData.bookingSetting !== "";
      case 18:
        return true; // 안내 단계
      case 19:
        return true; // 요금 설정은 기본값 있음
      case 20:
        return true; // 할인은 선택 사항
      case 21:
        return (
          formData.hostAddress.state !== "" &&
          formData.hostAddress.city !== "" &&
          formData.hostAddress.district !== ""
        );
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* 모달 컨테이너 */}
      <div className="relative w-full h-full bg-white flex flex-col">
        {/* 에러 메시지 */}
        {error && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="flex-shrink-0 text-red-600 hover:text-red-800"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* 상단 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            <button className="text-sm font-medium hover:bg-gray-100 px-4 py-2 rounded-lg transition">
              궁금하신 점이 있나요?
            </button>
            <button
              onClick={onClose}
              className="text-sm font-medium hover:bg-gray-100 px-4 py-2 rounded-lg transition"
            >
              저장 후 나가기
            </button>
          </div>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto px-6 py-8 scrollbar-hide">
          <div className="max-w-2xl mx-auto">
          {step === 1 && (
            <Step1HostingType
              selectedType={formData.hostingType}
              onSelect={(type) => updateFormData("hostingType", type)}
            />
          )}
          {step === 2 && <Step2GettingStarted />}
          {step === 3 && (
            <Step3PropertyType
              selectedType={formData.propertyType}
              onSelect={(type) => updateFormData("propertyType", type)}
            />
          )}
          {step === 4 && (
            <Step4GuestSpace
              selectedSpace={formData.guestSpace}
              onSelect={(space) => updateFormData("guestSpace", space)}
            />
          )}
          {step === 5 && (
            <Step5Address
              address={formData.address}
              showExactLocation={formData.showExactLocation}
              onUpdateAddress={(address: any) => updateFormData("address", address)}
              onToggleExactLocation={(value: boolean) =>
                updateFormData("showExactLocation", value)
              }
            />
          )}
          {step === 6 && <Step6MapConfirm address={formData.address} />}
          {step === 7 && (
            <Step7BasicInfo
              formData={{
                guests: formData.guests,
                bedrooms: formData.bedrooms,
                beds: formData.beds,
                bathrooms: formData.bathrooms,
              }}
              onUpdate={(data) => setFormData({ ...formData, ...data })}
            />
          )}
          {step === 8 && <Step8Showcase />}
          {step === 9 && (
            <Step9Amenities
              formData={{
                popularAmenities: formData.popularAmenities,
                standoutAmenities: formData.standoutAmenities,
              }}
              onUpdate={(data) => setFormData({ ...formData, ...data })}
            />
          )}
          {step === 10 && (
            <Step10Safety
              formData={{ safetyItems: formData.safetyItems }}
              onUpdate={(data) => setFormData({ ...formData, ...data })}
            />
          )}
          {step === 11 && <Step11PhotosIntro onAddPhotos={handleNext} />}
          {step === 12 && (
            <Step12PhotoUpload
              formData={{ photos: formData.photos }}
              onUpdate={(data) => setFormData({ ...formData, ...data })}
            />
          )}
          {step === 14 && (
            <Step14PropertyName
              formData={{ propertyName: formData.propertyName }}
              onUpdate={(data) => setFormData({ ...formData, ...data })}
            />
          )}
          {step === 15 && (
            <Step15Description
              formData={{ propertyDescription: formData.propertyDescription }}
              onUpdate={(data) => setFormData({ ...formData, ...data })}
            />
          )}
          {step === 16 && (
            <Step16Highlights
              formData={{ highlights: formData.highlights }}
              onUpdate={(data) => setFormData({ ...formData, ...data })}
            />
          )}
          {step === 17 && (
            <Step17BookingSettings
              formData={{ bookingSetting: formData.bookingSetting }}
              onUpdate={(data) => setFormData({ ...formData, ...data })}
            />
          )}
          {step === 18 && <Step18CompleteIntro />}
          {step === 19 && (
            <Step19WeekendPricing
              formData={{
                basePrice: formData.basePrice,
                weekendPremium: formData.weekendPremium,
              }}
              onUpdate={(data) => setFormData({ ...formData, ...data })}
            />
          )}
          {step === 20 && (
            <Step20Discounts
              formData={{ discounts: formData.discounts }}
              onUpdate={(data) => setFormData({ ...formData, ...data })}
            />
          )}
          {step === 21 && (
            <Step21FinalDetails
              formData={{ hostAddress: formData.hostAddress }}
              onUpdate={(data) => setFormData({ ...formData, ...data })}
              onCreateListing={handleCreateListing}
              isLoading={isLoading}
            />
          )}
          </div>
        </div>

        {/* 하단 네비게이션 - Step 21에서는 숨김 (자체 버튼 포함) */}
        {step !== 21 && (
          <div className="border-t border-gray-200 px-6 py-4 bg-white">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              {/* 뒤로 버튼 */}
              {step > 1 ? (
                <button
                  onClick={handleBack}
                  className="text-sm font-semibold underline hover:bg-gray-100 px-4 py-2 rounded-lg transition"
                >
                  뒤로
                </button>
              ) : (
                <div />
              )}

              {/* 다음/시작하기 버튼 */}
              <button
                onClick={handleNext}
                disabled={!canProceed() || isLoading}
                className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
                  canProceed() && !isLoading
                    ? "bg-gradient-to-r from-[#E61E4D] to-[#D70466] text-white hover:from-[#D70466] hover:to-[#BD1E59]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isLoading && (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {step === 2 || step === 18 ? "시작하기" : "다음"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
