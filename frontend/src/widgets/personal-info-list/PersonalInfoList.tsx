import { InfoRow } from "@/shared/ui/InfoRow";

export const PersonalInfoList = () => {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">개인 정보</h1>
      </div>
      <section>
        <InfoRow label="실명" value="이름" />
        <InfoRow label="선호하는 이름" value="미제출" buttonText="추가" />
        <InfoRow label="이메일 주소" value="l***8@gmail.com" />
        <InfoRow label="전화번호" value="+82 **-****-2985" isBorderBottom={false} />
      </section>
    </div>
  );
};