import { useState } from "react"; 

type SetLoginState = (next: boolean | ((prev: boolean) => boolean)) => void;
interface HeaderProfileProps {
  isLoggedIn: boolean;
  setIsLoggedIn: SetLoginState;
}

export default function HeaderProfile({ isLoggedIn, setIsLoggedIn }: HeaderProfileProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsMenuOpen(false); 
  };

  return (
    <div className="flex items-center space-x-4">
      <button className="text-sm font-medium hover:bg-gray-100 px-3 py-2 rounded-full">호스팅하기</button>
        
      {isLoggedIn ? (
        <button className="bg-gray-200 w-8 h8 rounded-full flex items-center justify-center text-sm font-bold">닉네임</button>
      ) : (
        <button className="text-xl">🌍</button>
      )}
    </div>

  )
}

