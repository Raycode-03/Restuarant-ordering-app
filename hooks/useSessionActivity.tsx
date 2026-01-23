'use client';

import { useEffect, useRef } from 'react';  
import { sessionsApi } from '@/lib/api/sessions';
import { useQuery  } from '@tanstack/react-query';
interface UseSessionActivityOptions {
  onSessionExpired?: () => void;
  onSessionInactive?: () => void;
  activityThrottle?: number;
}

export function useSessionActivity({
  onSessionExpired,
  onSessionInactive,
  activityThrottle = 2 * 60 * 1000,
}: UseSessionActivityOptions = {}) {
  const lastUpdateRef = useRef(0);
  const hasInitializedRef = useRef(false);
  const {
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: ['session', 'validate'],
    queryFn: sessionsApi.validateSession,
    enabled: false, // manual only
    retry: false,
  });

  // Handle session errors (v5 way)
  useEffect(() => {
    if (!isError || !(error instanceof Error)) return;

    if (error.message === 'Session expired') {
      onSessionExpired?.();
    } else if (error.message === 'Session inactive') {
      onSessionInactive?.();
    }
  }, [isError, error, onSessionExpired, onSessionInactive]);

  // Activity tracking
  useEffect(() => {
    const init = setTimeout(() => {
      hasInitializedRef.current = true;
      refetch();
    }, 2000);

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];

    const handleActivity = () => {
      if (!hasInitializedRef.current) return;

      const now = Date.now();
      if (now - lastUpdateRef.current > activityThrottle) {
        refetch();
        lastUpdateRef.current = now;
      }
    };

    events.forEach(event =>
      window.addEventListener(event, handleActivity, { passive: true })
    );

    return () => {
      clearTimeout(init);
      events.forEach(event =>
        window.removeEventListener(event, handleActivity)
      );
    };
  }, [activityThrottle, refetch]);
}
