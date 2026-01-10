"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type LoadingType = 'form' | 'google' | 'github' | null;

interface AuthLoadingContextType {
  loadingType: LoadingType;
  setLoadingType: (type: LoadingType) => void;
}

const AuthLoadingContext = createContext<AuthLoadingContextType | undefined>(undefined);

export function AuthLoadingProvider({ children }: { children: ReactNode }) {
  const [loadingType, setLoadingType] = useState<LoadingType>(null);

  return (
    <AuthLoadingContext.Provider value={{ loadingType, setLoadingType }}>
      {children}
    </AuthLoadingContext.Provider>
  );
}

export function useAuthLoading() {
  const context = useContext(AuthLoadingContext);
  if (context === undefined) {
    throw new Error('useAuthLoading must be used within AuthLoadingProvider');
  }
  return context;
}