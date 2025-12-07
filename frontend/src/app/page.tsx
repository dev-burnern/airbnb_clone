'use client';

import { Suspense } from "react";
import MainHeader from '@/widgets/main_header/Header';
import MainPage from './(main)/page';

export default function RootPage() {
    return (
        <>
            <MainHeader />
            <Suspense fallback={<div>Loading...</div>}>
                <MainPage />
            </Suspense>
        </>
    );
}
