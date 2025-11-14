export default function MessageSideInfo() {
  return (
    <aside className="w-[300px] border-l border-gray-200 p-8">
      <div className="flex items-center gap-4 mb-4">
        <img src="/images/airbnb_logo.png" className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-semibold">에어비앤비 고객지원팀</p>
          <p className="text-gray-500 text-sm">
            에어비앤비 고객지원 팀의 도움을 받으세요.
          </p>
        </div>
      </div>
    </aside>
  );
}