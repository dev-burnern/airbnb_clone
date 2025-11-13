import MessageList from "@/widgets/messages/MessageList";
import MessageDetail from "@/widgets/messages/MessageDetail";

const sampleConversation = {
  title: "에어비앤비 고객지원 팀",
  date: "2023년 1월 4일",
  messages: [
    {
      sender: "에어비앤비 고객지원 팀",
      text: "숙박 기간 동안 도움이 필요하면 호스트 Anna 님에게 연락하실 수 있지만, 에어비앤비의 도움이 필요하다면 언제든지 알려주세요. 연중무휴 지원을 제공해드립니다.",
      avatar: "/images/airbnb_logo.png",
    },
  ],
};

export default function MessageDetailPage() {
  return (
    <main className="h-screen flex bg-white">

      {/* 왼쪽 메시지 리스트 */}
      <MessageList />

      {/* ⭐ 오른쪽 전체 영역(wrapper) */}
      <div className="flex-1 flex flex-col">

  {/* 제목 + 전체 선 */}
  <div className="px-24 pt-12 pb-6">
    <h1 className="text-2xl font-semibold text-gray-900 text-center">
      {sampleConversation.title}
    </h1>

    <hr className="w-full border-gray-200 mt-4" />
  </div>

  {/* 메시지 내용 */}
  <div className="flex-1 overflow-y-auto px-24">
    <MessageDetail conversation={sampleConversation} />
  </div>
</div>

    </main>
  );
}