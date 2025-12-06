// src/app/(main)/layout.tsx (헤더를 넣을 파일)

import React from "react";
// 중앙 검색창이 있는 메인 헤더를 임포트
import MainHeader from "@/widgets/main_header/Header"; 

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* ✅ 메인 페이지와 그 하위 페이지를 위한 헤더 적용 */}
            <MainHeader />
            
            {/* children은 src/app/(main)/page.tsx의 MainPage 컴포넌트입니다. */}
            {children}
        </>
    );
}