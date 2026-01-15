"use client";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import LogoutButton from "@/components/auth/logoutButton"

export default function InactiveAccount() {
  const [requestSent, setRequestSent] = useState(false);
 const handleRequestActivation = async () => {
  const toastId = toast.loading("Sending activation request...");
  try {
    const response = await fetch('/api/admin/notifications/request-activation', {
      method: 'POST',
    });
    const data = await response.json();
    if (!response.ok) {
      toast.error(data.error || "Request failed", { id: toastId });
      return;
    }

    setRequestSent(true);
    toast.success("Request sent successfully!", { id: toastId });
  } catch (error) {
    console.error(error);
    toast.error(
      "Failed to send request. Please try again later.",
      { id: toastId }
    );
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          {/* Warning Icon */}
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <TriangleAlert color="#f4c10b"/>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Account Inactive
        </h2>
        
        <p className="text-gray-600 mb-6">
          Your account is currently not active. Please contact the administrator to activate your account.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> You won&apos;t be able to access any features until your account is activated.
          </p>
        </div>

        {requestSent && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <p className="text-sm text-green-800">
              ✓ Request sent! An administrator will review your account soon.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {/* In-App Request Button (Primary action) */}
          <button
            onClick={handleRequestActivation}
            disabled={requestSent}
            className="block w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {requestSent ? "Request Sent" : "Request Activation"}
          </button>

          <LogoutButton className=" text-white rounded-md hover:bg-red-500 transition bg-red-600 opacity-92 w-full px-6 py-3">
              Logout
          </LogoutButton>
        </div>
      </div>
    </div>
  );
}