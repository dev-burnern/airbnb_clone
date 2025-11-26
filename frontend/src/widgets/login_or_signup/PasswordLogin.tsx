"use client";

import React, { useEffect, useState } from "react";
import axios from "axios"; 
import { useAuth, User } from "../../app/providers/AuthContext";

type Props = {
  open: boolean;
  email: string;
  onClose?: () => void;
  onBack?: () => void;
  onSubmit?: () => void; 
};

const API_BASE_URL = 'http://localhost:3001'; 

export default function PasswordLogin({
  open,
  email,
  onClose,
  onBack,
  onSubmit, 
}: Props) {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setPassword("");
      setShowPassword(false);
      setError(null);
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleLogin = async () => {
    if (!password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { access_token, user } = response.data;

      login(access_token, user as User);
      
      onClose?.(); 
      onSubmit?.();
      
    } catch (err: any) {
      console.error("Login API Error:", err);
      
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || "로그인에 실패했습니다. 비밀번호를 확인해주세요.";
        setError(message);
      } else {
        setError("서버 연결에 실패했거나 알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* dimmed background */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* modal */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center">
          <button
            type="button"
            onClick={onBack}
            aria-label="뒤로가기"
            className="mr-2 text-gray-700 hover:text-gray-900"
          >
            {/* 간단한 ← 아이콘 */}
            <span className="text-xl">&larr;</span>
          </button>
          <h3 className="flex-1 text-center text-lg font-semibold">로그인</h3>
          {/* 오른쪽 공간 맞추기용 */}
          <div className="w-6" />
        </div>

        <div className="p-6">
          {/* 이메일 보여주기 (선택) */}
          <p className="text-xs text-gray-500 mb-1">이메일</p>
          <p className="text-sm font-medium text-gray-900 mb-4">{email}</p>

          <div>
            <label className="block text-xs font-medium text-gray-600">
              비밀번호
            </label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                className="w-full border border-gray-200 rounded-md px-3 py-2 pr-16 focus:outline-none focus:ring-2 focus:ring-pink-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLogin();
                }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 my-auto text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                {showPassword ? "숨기기" : "표시"}
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading} 
            className={`mt-6 w-full text-white py-2 rounded-md font-medium transition ${
              isLoading ? "bg-pink-400 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-700"
            }`}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>

          <button
            type="button"
            className="mt-3 text-sm text-gray-700 hover:underline"
          >
            비밀번호를 잊으셨나요?
          </button>
        </div>
      </div>
    </div>
  );
}