// app/menu/[table]/SessionProvider.tsx
'use client';

import { useSessionActivity } from '@/hooks/useSessionActivity';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState, useCallback } from 'react';

interface SessionProviderProps {
  children: React.ReactNode;
  tableNumber: number;
}

export default function SessionProvider({ 
  children, 
  tableNumber 
}: SessionProviderProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSessionExpired = useCallback(() => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    
    toast.error('Session Expired', {
      description: 'Your session has expired. Redirecting...',
      duration: 3000,
    });

    setTimeout(() => {
      router.push(`/menu/${tableNumber}`); // Re-navigate to trigger new session
      router.refresh();
    }, 2000);
  }, [isRefreshing, router, tableNumber]);

  const handleSessionInactive = useCallback(() => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    
    toast.error('Session Inactive', {
      description: 'Your session ended due to inactivity. Redirecting...',
      duration: 3000,
    });

    setTimeout(() => {
      router.push(`/menu/${tableNumber}`);
      router.refresh();
    }, 2000);
  }, [isRefreshing, router, tableNumber]);

  useSessionActivity({
    onSessionExpired: handleSessionExpired,
    onSessionInactive: handleSessionInactive,
    activityThrottle: 60 * 1000,     // 1 minute
  });

  if (isRefreshing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Refreshing your session...</p>
          <p className="text-sm text-gray-500 mt-2">Table {tableNumber}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}