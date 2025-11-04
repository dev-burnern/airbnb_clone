import React from "react";

export default function HeaderSearchBar() {
  return (
    <div className="flex items-center justify-between bg-white rounded-full shadow-md px-4 py-2 hover:shadow-lg transition w-[850px]">

      <div className="flex flex-col px-4 py-2 hover:bg-gray-100 rounded-full cursor-pointer">
        <span className="text-xs font-semibold text-gray-800">여행지</span>
        <span className="text-sm text-gray-500">여행지 검색</span>
      </div>

      <div className="h-6 w-px bg-gray-300"></div>

      <div className="flex flex-col px-4 py-2 hover:bg-gray-100 rounded-full cursor-pointer">
        <span className="text-xs font-semibold text-gray-800">체크인</span>
        <span className="text-sm text-gray-500">날짜 추가</span>
      </div>

      <div className="h-6 w-px bg-gray-300"></div>

      <div className="flex flex-col px-4 py-2 hover:bg-gray-100 rounded-full cursor-pointer">
        <span className="text-xs font-semibold text-gray-800">체크아웃</span>
        <span className="text-sm text-gray-500">날짜 추가</span>
      </div>

      <div className="h-6 w-px bg-gray-300"></div>

      <div className="flex flex-col px-4 py-2 hover:bg-gray-100 rounded-full cursor-pointer">
        <span className="text-xs font-semibold text-gray-800">여행자</span>
        <span className="text-sm text-gray-500">게스트 추가</span>
      </div>

     <button className="ml-3 bg-rose-500 text-white rounded-full p-3 hover:bg-rose-600 transition flex items-center justify-center">
        🔍
      </button>
    </div>
  );
}
