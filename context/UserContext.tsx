"use client";

import { createContext, useContext, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import type { StaffMember, UserContextType } from '@/types';


const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
  user,
  staff,
}: {
  children: ReactNode;
  user: User;
  staff: StaffMember;
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