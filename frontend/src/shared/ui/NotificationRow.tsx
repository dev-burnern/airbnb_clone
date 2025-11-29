// src/shared/ui/NotificationRow.tsx

interface NotificationRowProps {
  title: string;
  description: string;
  currentSetting: string;
  isBorderBottom?: boolean;
}

export const NotificationRow = ({
  title,
  description,
  currentSetting,
  isBorderBottom = true,
}: NotificationRowProps) => {
  return (
    <div className={`py-6 ${isBorderBottom ? "border-b border-gray-200" : ""}`}>
      <h3 className="text-gray-900 font-medium">{title}</h3>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
      
      <div className="flex justify-between items-center mt-3">
        <p className="text-gray-500 text-sm">{currentSetting}</p>
        <button className="text-gray-900 underline text-sm font-medium hover:text-gray-600 whitespace-nowrap ml-4">
          수정
        </button>
      </div>
    </div>
  );
};