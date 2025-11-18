interface InfoRowProps {
  label: string;
  value: string;
  buttonText?: string;
  isBorderBottom?: boolean;
}

export const InfoRow = ({
  label,
  value,
  buttonText = "수정",
  isBorderBottom = true,
}: InfoRowProps) => {
  return (
    <div className={`flex justify-between py-6 ${isBorderBottom ? "border-b border-gray-200" : ""}`}>
      <div>
        <h3 className="text-gray-900 font-medium">{label}</h3>
        <p className="text-gray-500 text-sm mt-1">{value}</p>
      </div>
      <button className="text-gray-900 underline text-sm font-medium hover:text-gray-600 whitespace-nowrap ml-4">
        {buttonText}
      </button>
    </div>
  );
};