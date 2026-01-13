'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
        <p className="mt-2 text-gray-600">
          {error.message || 'We apologize for the inconvenience.'}
        </p>
        <div className="mt-6 space-y-3">
          <button
            onClick={() => reset()}
            className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
          >
            Try again
          </button>
          <a
            href="/" className="block w-full px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}