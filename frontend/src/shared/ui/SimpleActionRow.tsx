// src/shared/ui/SimpleActionRow.tsx

interface SimpleActionRowProps {
  title: string;
  valueDescription?: string; // 예: "생성되지 않음"
  actionButtonText: string;
  isBorderBottom?: boolean;
}

export const SimpleActionRow = ({
  title,
  valueDescription,
  actionButtonText,
  isBorderBottom = true,
}: SimpleActionRowProps) => {
  return (
    <div className={`flex justify-between items-start py-6 ${isBorderBottom ? "border-b border-gray-200" : ""}`}>
      <div>
        <h3 className="text-gray-900 font-medium">{title}</h3>
        {valueDescription && (
          <p className="text-gray-500 text-sm mt-1">{valueDescription}</p>
        )}
      </div>
      <button className="text-gray-900 underline text-sm font-medium hover:text-gray-600 whitespace-nowrap ml-4">
        {actionButtonText}
      </button>
    </div>
  );
};