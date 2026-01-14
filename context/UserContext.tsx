"use client";

import { createContext, useContext, ReactNode } from "react";
import { User } from "@supabase/supabase-js";

interface Staff {
  id: string;
  role: string;
  is_active: boolean;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

interface UserContextType {
  user: User;
  staff: Staff;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
  user,
  staff,
}: {
  children: ReactNode;
  user: User;
  staff: Staff;
}) {
  return (
    <UserContext.Provider value={{ user, staff }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
}