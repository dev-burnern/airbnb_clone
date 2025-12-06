"use client";

export default function Step2GettingStarted() {
  const steps = [
    {
      number: "1",
      title: "숙소 정보를 알려주세요",
      description:
        "숙소 위치와 숙박 가능 인원 등 기본 정보를 알려주세요.",
      image: "/images/host/step1.jpg",
    },
    {
      number: "2",
      title: "숙소를 돋보이게 하세요",
      description:
        "사진 5장 이상 제출하고 제목과 설명을 추가해주시면 숙소가 돋보일 수 있도록 도와드립니다.",
      image: "/images/host/step2.jpg",
    },
    {
      number: "3",
      title: "등록을 완료하세요",
      description:
        "호스팅 초기에 적용될 요금을 설정하고, 세부 정보를 인증한 다음 리스팅을 게시하세요.",
      image: "/images/host/step3.jpg",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-semibold mb-16">
        간단하게 에어비앤비 호스팅을 시작할 수 있습니다
      </h1>

      <div className="space-y-12">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-8">
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-600 mb-2">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
            <div className="w-40 h-32 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
              {/* 이미지 플레이스홀더 */}
              <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
