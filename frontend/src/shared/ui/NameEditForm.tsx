export const NameEditForm = ({ onClose }: { onClose?: () => void }) => {
  return (
    <div className="space-y-4">
      <p className="mb-4 text-sm text-gray-500">
        다음 예약 전에 새로 실명 확인 절차를 거쳐야 합니다.
      </p>
      <div className="flex space-x-4">
        {/* 신분증에 기재된 이름 */}
        <div className="flex-1">
          <label htmlFor="givenName" className="text-xs text-gray-500">
            신분증에 기재된 이름(예: 길동)
          </label>
          <input
            type="text"
            id="givenName"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 placeholder-gray-400"
            defaultValue="민서" // 현재 값
          />
        </div>
        {/* 신분증에 기재된 성 */}
        <div className="flex-1">
          <label htmlFor="familyName" className="text-xs text-gray-500">
            신분증에 기재된 성(예: 홍)
          </label>
          <input
            type="text"
            id="familyName"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 placeholder-gray-400"
            defaultValue="임" // 현재 값
          />
        </div>
      </div>
      <button
        onClick={() => onClose?.()}
        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
      >
        저장 및 계속 진행
      </button>
    </div>
  );
};