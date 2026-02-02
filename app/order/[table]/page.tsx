'use client';
import React,{ useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sessionsApi } from '@/lib/api/sessions';
interface PageProps {
  params: Promise<{ table: string }>; 
}

export default function OrderPage({ params }: PageProps) {
  const paramsData = React.use(params); // unwrap the promise
  const tableNumber = Number(paramsData.table);
  const [sessionCreated, setSessionCreated] = useState(false);
  // const {
  //   isLoading,
  //   isSuccess,
  //   isError,
  //   error,
  // } = useQuery({
  //   queryKey: ['session', tableNumber],
  //   queryFn: () => sessionsApi.startSession(tableNumber),
  //   enabled: Number.isFinite(tableNumber) && !sessionCreated,
  //   retry: false,
  // });

  // // Success side effect
  // useEffect(() => {
  //   if (isSuccess && !sessionCreated) {
  //     setSessionCreated(true);
  //     toast.success('Session started', {
  //       description: `Welcome to Table ${tableNumber}`,
  //     });
  //   }
  // }, [isSuccess, sessionCreated, tableNumber]);

  // // Error side effect
  // useEffect(() => {
  //   if (isError && error instanceof Error) {
  //     toast.error('Failed to create session', {
  //       description: error.message,
  //     });
  //   }
  // }, [isError, error]);

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
  //         <p className="text-gray-600">Setting up your table...</p>
  //         <p className="text-sm text-gray-500 mt-2">
  //           Table {tableNumber}
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Table {tableNumber}
      </h1>

    </div>
  );
}
