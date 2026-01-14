'use client';
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "An unexpected authentication error occurred";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-red-600">Authentication Error</h2>
        <p className="mt-4 text-gray-600">
          {message}
        </p>
        <div className="mt-6 space-y-3">
          <Link
            href="/admin/login"
            className="block w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
          >
            Back to Login
          </Link>
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}