"use client";

import React, { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose?: () => void;
  onSubmit?: (email: string) => void;
};

export default function EmailLogion({ open, onClose, onSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setError(null);
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const validateEmail = (value: string) => {
    // simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleContinue = () => {
    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }
    if (!validateEmail(email)) {
      setError("유효한 이메일 주소를 입력해주세요.");
      return;
    }
    setError(null);
    onSubmit?.(email);
  };

  const handleGithub = () => {
    // redirect to GitHub OAuth endpoint (adjust to your backend route)
    window.location.href = "/api/auth/github";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">로그인 또는 회원 가입</h3>
            <button
              onClick={onClose}
              aria-label="닫기"
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-700">에어비앤비에 오신 것을 환영합니다.</p>

          <div className="mt-5">
            <label className="block text-xs font-medium text-gray-600">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <button
            onClick={handleContinue}
            className="mt-6 w-full bg-pink-600 text-white py-2 rounded-md font-medium hover:bg-pink-700"
          >
            계속
          </button>

          <div className="my-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">또는</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            onClick={handleGithub}
            className="w-full border border-gray-200 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-gray-800"
            >
              <path d="M12 .297a12 12 0 00-3.797 23.391c.6.111.82-.261.82-.58 0-.287-.01-1.047-.015-2.054-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.775.418-1.305.762-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.469-2.381 1.236-3.222-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 016.003 0c2.292-1.552 3.297-1.23 3.297-1.23.656 1.653.244 2.873.12 3.176.77.841 1.235 1.912 1.235 3.222 0 4.61-2.806 5.624-5.479 5.921.43.372.813 1.102.813 2.222 0 1.605-.014 2.9-.014 3.293 0 .321.216.697.825.579A12.001 12.001 0 0012 .297z" />
            </svg>
            <span className="text-sm font-medium">GitHub로 로그인</span>
          </button>
        </div>
      </div>
    </div>
  );
}
