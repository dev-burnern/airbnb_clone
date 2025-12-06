export const PhoneEditForm = ({ onClose }: { onClose?: () => void }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        알림, 미리 알림 및 로그인에 도움이 됩니다.
      </p>

      {/* 국가/지역 드롭다운 */}
      <div>
        <label htmlFor="country" className="block text-xs font-medium text-gray-700">
          국가/지역
        </label>
        <select
          id="country"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
          defaultValue="한국 (+82)"
        >
          <option>한국 (+82)</option>
          {/* 다른 국가 옵션... */}
        </select>
      </div>

      {/* 전화번호 입력 */}
      <div>
        <label htmlFor="phone" className="block text-xs font-medium text-gray-700 sr-only">
          전화번호
        </label>
        <input
          type="tel"
          id="phone"
          placeholder="+82"
          className="block w-full border border-gray-300 rounded-md shadow-sm p-3 placeholder-gray-400"
          defaultValue="+82"
        />
      </div>

      <p className="text-sm text-gray-500">
        전화번호 인증 코드를 보내드리겠습니다. 일반 문자 메시지 요금 및 데이터 요금이 부과됩니다.
      </p>

      <button
        onClick={() => onClose?.()}
        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
      >
        인증
      </button>
    </div>
  );
};