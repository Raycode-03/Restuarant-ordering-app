'use client';

import { useRouter } from 'next/navigation';
import { AlertCircle, Clock, XCircle } from 'lucide-react';

interface InactiveSessionProps {
  reason: 'expired' | 'inactive';
}

export default function InactiveSession({ reason }: InactiveSessionProps) {
  const router = useRouter();

  const handleStartNewSession = async () => {
    // Clear the session cookie
    await fetch('/api/session/end', { method: 'POST' });
    router.push('/start-session');
  };

  const content = {
    expired: {
      icon: <Clock className="w-16 h-16 text-orange-500" />,
      title: 'Session Expired',
      message: 'Your session has expired after 1 hour. Please start a new session to continue.',
      color: 'orange'
    },
    inactive: {
      icon: <XCircle className="w-16 h-16 text-red-500" />,
      title: 'Session Inactive',
      message: 'Your session has been ended due to inactivity. Please start a new session to continue.',
      color: 'red'
    }
  };

  const { icon, title, message, color } = content[reason];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            {icon}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {title}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>

          <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-4 mb-6`}>
            <div className="flex items-start">
              <AlertCircle className={`w-5 h-5 text-${color}-500 mr-2 flex-shrink-0 mt-0.5`} />
              <p className={`text-sm text-${color}-700 text-left`}>
                {reason === 'expired' 
                  ? 'Sessions automatically expire after 1 hour for security purposes.'
                  : 'Sessions are ended after 15 minutes of inactivity to free up the table.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleStartNewSession}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Start New Session
          </button>

          <p className="text-sm text-gray-500 mt-4">
            Need help? Contact restaurant staff
          </p>
        </div>
      </div>
    </div>
  );
}