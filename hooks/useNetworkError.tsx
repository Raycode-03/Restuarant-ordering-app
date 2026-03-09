// hooks/useNetworkError.ts
import { useEffect } from 'react';
import { toast } from 'sonner';

export function useNetworkError(isError: boolean, error: unknown, fallbackMessage = 'Something went wrong') {
  useEffect(() => {
    if (!isError || !(error instanceof Error)) return;

    if (
      !navigator.onLine ||
      error.message === 'NETWORK_ERROR' ||
      error.message.includes('Failed to fetch')
    ) {
      toast.error('Connection issue', {
        description: 'Poor internet connection. Please check your network.',
        duration: 1000,
      });
      return;
    }

    toast.error(fallbackMessage, {
      description: error.message,
    });
  }, [isError, error, fallbackMessage]);
}