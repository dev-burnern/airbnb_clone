'use client';

import { useEffect } from 'react';
import { initializeApiInterceptor } from '@/api';

/**
 * API 인터셉터를 초기화하는 클라이언트 컴포넌트
 * 모든 fetch 요청을 자동으로 localhost:3001 → /backend로 변환
 */
export default function ApiInterceptorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initializeApiInterceptor();
  }, []);

  return <>{children}</>;
}
