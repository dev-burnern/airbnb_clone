export const EmailEditForm = ({ onClose }: { onClose?: () => void }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        언제든지 확인하실 수 있는 주소를 사용하세요
      </p>
      <input
        type="email"
        placeholder="이메일 주소"
        className="block w-full border border-gray-300 rounded-md shadow-sm p-3 placeholder-gray-400"
      />
      <button
        onClick={() => onClose?.()}
        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
      >
        저장
      </button>
    </div>
  );
};