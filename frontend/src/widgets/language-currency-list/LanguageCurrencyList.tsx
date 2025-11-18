import { InfoRow } from "@/shared/ui/InfoRow";

export const LanguageCurrencyList = () => {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">언어 및 통화</h1>
      </div>
      <section>
        <InfoRow label="선호하는 언어" value="한국어" />
        <InfoRow label="선호하는 통화" value="한국 원" />
        <InfoRow label="시간대" value="미제출" isBorderBottom={false} buttonText="수정" />
      </section>
    </div>
  );
};