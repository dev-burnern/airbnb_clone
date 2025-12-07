"use client";

interface Step5AddressProps {
  address: {
    country: string;
    state: string;
    city: string;
    district: string;
    street: string;
    detail: string;
    postalCode: string;
  };
  showExactLocation: boolean;
  onUpdateAddress: (address: any) => void;
  onToggleExactLocation: (value: boolean) => void;
}

export default function Step5Address({
  address,
  showExactLocation,
  onUpdateAddress,
  onToggleExactLocation,
}: Step5AddressProps) {
  const handleInputChange = (field: string, value: string) => {
    onUpdateAddress({ ...address, [field]: value });
  };

  return (
    <div className="py-6">
      <h1 className="text-3xl font-semibold mb-3">주소 확인</h1>
      <p className="text-sm text-gray-600 mb-8">
        주소는 게스트의 예약이 확정된 이후에 공개됩니다.
      </p>

      <div className="space-y-4">
        {/* 국가/지역 */}
        <div>
          <label className="block text-xs font-medium mb-1">국가/지역</label>
          <select
            value={address.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
          >
            <option value="한국 - KR">한국 - KR</option>
            <option value="미국 - US">미국 - US</option>
            <option value="일본 - JP">일본 - JP</option>
          </select>
        </div>

        {/* 도/특/별/광/자/시 */}
        <div>
          <label className="block text-xs font-medium mb-1">
            도/특/별/광/자/시
          </label>
          <input
            type="text"
            value={address.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
            placeholder="Daegu"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
          />
        </div>

        {/* 도시(해당하는 경우) */}
        <div>
          <label className="block text-xs font-medium mb-1">
            도시(해당하는 경우)
          </label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
          />
        </div>

        {/* 군/구(해당하는 경우) */}
        <div>
          <label className="block text-xs font-medium mb-1">
            군/구(해당하는 경우)
          </label>
          <input
            type="text"
            value={address.district}
            onChange={(e) => handleInputChange("district", e.target.value)}
            placeholder="Buk-gu"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
          />
        </div>

        {/* 도로명 주소 */}
        <div>
          <label className="block text-xs font-medium mb-1">도로명 주소</label>
          <input
            type="text"
            value={address.street}
            onChange={(e) => handleInputChange("street", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
          />
        </div>

        {/* 아파트/층수/호수, 건물명 */}
        <div>
          <label className="block text-xs font-medium mb-1">
            아파트/층수/호수, 건물명(해당하는 경우)
          </label>
          <input
            type="text"
            value={address.detail}
            onChange={(e) => handleInputChange("detail", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
          />
        </div>

        {/* 우편번호 */}
        <div>
          <label className="block text-xs font-medium mb-1">
            우편번호(해당하는 경우)
          </label>
          <input
            type="text"
            value={address.postalCode}
            onChange={(e) => handleInputChange("postalCode", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
          />
        </div>

        {/* 구체적인 위치 표시하기 토글 */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-3">
              <h3 className="font-semibold mb-1 text-sm">구체적인 위치 표시하기</h3>
              <p className="text-xs text-gray-600">
                숙소의 정확한 위치를 게스트에게 보여줍니다. 정확한 위치는 예약 확정 후 게스트에게만 공개됩니다.
              </p>
            </div>
            <button
              onClick={() => onToggleExactLocation(!showExactLocation)}
              className={`relative w-11 h-6 rounded-full transition ${
                showExactLocation ? "bg-gray-900" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  showExactLocation ? "translate-x-5" : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
