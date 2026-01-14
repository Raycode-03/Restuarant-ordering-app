import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-red-600">403</h1>

        <h2 className="mt-4 text-3xl font-bold text-gray-900">
          Access Denied
        </h2>

        <p className="mt-2 text-lg text-gray-600">
          You don&apos;t have permission to access this page.
        </p>

        <div className="mt-8 space-y-4">
          <Link
            href="/"
            className="inline-flex w-full justify-center px-6 py-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Go Home
          </Link>

          <Link
            href="/admin/login"
            className="inline-flex w-full justify-center px-6 py-3 text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200"
          >
            Login with another account
          </Link>
        </div>
      </div>
    </div>
  );
}
