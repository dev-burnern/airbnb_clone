"use client";

import { useAuth } from "../../app/providers/AuthContext";


export default function HeaderProfile() {
  const { user, isLoggedIn } = useAuth();
  
  const getInitial = (name?: string) => {
    return name ? name.charAt(0).toUpperCase() : (user?.email.split('@')[0] || '👤');
  };

  return (
    <div className="flex items-center space-x-4">
      <button className="text-sm font-medium hover:bg-gray-100 px-3 py-2 rounded-full">호스팅하기</button>
        
      {isLoggedIn ? (
        <button className="bg-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md">
          {user?.avatarUrl ? (
            <span className="w-full h-full">Avatar</span>
          ) : (
            getInitial(user?.name)
          )}
        </button>
      ) : (
        <button className="text-xl">🌍</button>
      )}
    </div>
  );
}