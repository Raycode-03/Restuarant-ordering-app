"use client";

import { useLogout } from "@/lib/auth/logout";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function LogoutButton({ className, children }: LogoutButtonProps) {
  const { logout } = useLogout();

  return (
    <button 
      onClick={logout} 
      className={className || "px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"}
    >
      {children || "Logout"}
    </button>
  );
}