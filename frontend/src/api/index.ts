/**
 * API 요청을 위한 기본 URL 생성 함수
 * - 클라이언트 사이드: /backend를 통해 rewrites로 라우팅
 * - 서버 사이드: http://backend:3001로 직접 연결
 * - ngrok 환경: 환경 변수로 설정 가능
 */

const API_BASE_URL = typeof window !== 'undefined'
  ? '/backend' // 클라이언트: rewrites 사용
  : '/backend'; // 서버: nginx 프록시

export { API_BASE_URL };

/**
 * localhost:3001을 /backend로 변환하는 URL 정규화 함수
 */
export function normalizeUrl(url: string): string {
  if (typeof window === 'undefined') {
    // 서버 사이드: 변환 없음
    return url;
  }
  
  // 클라이언트 사이드: localhost:3001 → /backend 변환
  return url.replace(
    /http:\/\/(localhost:)?3001/g,
    '/backend'
  );
}

/**
 * 글로벌 fetch 오버라이드
 * 모든 API 호출을 자동으로 /backend로 리다이렉트
 */
export function initializeApiInterceptor() {
  if (typeof window === 'undefined') return;

  const originalFetch = window.fetch;

  window.fetch = function (
    input: string | Request,
    init?: RequestInit
  ): Promise<Response> {
    let url: string;

    if (typeof input === 'string') {
      url = normalizeUrl(input);
    } else {
      url = normalizeUrl(input.url);
    }

    return originalFetch(url, init);
  } as typeof fetch;
}

/**
 * Fetch API를 사용한 GET 요청
 */
export async function apiGet<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `/backend${path}`;
  const response = await fetch(url, {
    ...options,
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch API를 사용한 POST 요청
 */
export async function apiPost<T>(
  path: string,
  body?: unknown,
  options?: RequestInit
): Promise<T> {
  const url = `/backend${path}`;
  const response = await fetch(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

