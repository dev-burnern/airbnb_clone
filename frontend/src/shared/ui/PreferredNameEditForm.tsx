export const PreferredNameEditForm = ({ onClose }: { onClose?: () => void }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        호스트와 게스트에게 표시되는 이름입니다. 자세히 알아보기
      </p>
      <input
        type="text"
        placeholder="선호하는 이름(선택사항)"
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