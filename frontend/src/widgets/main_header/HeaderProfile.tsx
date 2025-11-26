"use client";

import Image from "next/image"; 
import { useAuth } from "../../app/providers/AuthContext";


export default function HeaderProfile() {
  const { user, isLoggedIn } = useAuth();
  

  const getInitial = (name?: string) => {
    if (name && name.length > 0) {
        return name.charAt(0).toUpperCase();
    }
    const emailPart = user?.email?.split('@')[0];
    return emailPart && emailPart.length > 0 ? emailPart.charAt(0).toUpperCase() : 'A';
  };

  return (
    <div className="flex items-center space-x-2">
      <button className="text-sm font-medium hover:bg-gray-100 px-3 py-2 rounded-full hidden sm:block">
        호스팅하기
      </button>
      
      <button className="p-2 rounded-full hover:bg-gray-100 transition-colors hidden sm:block" aria-label="언어 선택">
        <span className="text-xl">🌍</span>
      </button>

      <div 
        className="flex items-center space-x-2 border border-gray-300 rounded-full p-1 cursor-pointer hover:shadow-md transition-shadow"
      >
        {isLoggedIn && (
          <div className="bg-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm overflow-hidden">
            {user?.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={`${user.name || user.email}'s avatar`}
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            ) : (
              getInitial(user?.name)
            )}
          </div>
        )}

        {!isLoggedIn && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            fill="currentColor"
            className="w-6 h-6 text-gray-500"
          >
            <path d="M16 16c4.42 0 8-3.58 8-8s-3.58-8-8-8-8 3.58-8 8 3.58 8 8 8zm0 4c-5.32 0-11 2.66-11 8v2h22v-2c0-5.34-5.68-8-11-8z" />
          </svg>
        )}
      </div>
    </div>
  );
}