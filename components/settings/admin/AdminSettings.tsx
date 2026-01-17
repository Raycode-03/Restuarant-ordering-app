"use client"
import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner';
import { QrCode, Printer, Plus, Minus, Copy, RefreshCw } from 'lucide-react';
import QRCode from 'qrcode';
import { settingsApi } from '@/lib/api/settings';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
interface TableQR {
  tableNumber: number;
  qrCodeUrl: string;
  paymentCode: string;
}

function AdminSettings() {
  const queryClient = useQueryClient();
  const [tableCount, setTableCount] = useState(10);
  const [newPaymentCode, setNewPaymentCode] = useState('');
  const [qrCodes, setQrCodes] = useState<TableQR[]>([]);
  const [showQRGrid, setShowQRGrid] = useState(false);
  const [generating, setGenerating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Fetch settings
  const { data: settings, isLoading, isError } = useQuery({
    queryKey: ['restaurant-settings'],
    queryFn: settingsApi.getSettings
  });

  // Show error toast
  useEffect(() => {
    if (isError) {
      toast.error('Failed to load settings');
    }
  }, [isError]);

  // Update table count when settings are loaded
  useEffect(() => {
    if (settings?.success && settings.data) {
      setTableCount(settings.data.table_count || 10);
    }
  }, [settings]);

  const paymentCode = settings?.data?.order_code?.toString() || '0000';

  // Update payment code mutation
  const updatePaymentMutation = useMutation({
    mutationFn: (code: number) => settingsApi.paymentChange(code),
    onSuccess: () => {
      toast.success('Payment code updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['restaurant-settings'] });
      setNewPaymentCode('');
      // Regenerate QR codes with new payment code
      if (showQRGrid) {
        generateQRCodes();
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update payment code');
    }
  });

  // Update table count mutation
  const updateTableCountMutation = useMutation({
    mutationFn: (count: number) => settingsApi.tableNumberChange(count),
    onSuccess: () => {
      toast.success(`Generated ${tableCount} QR codes successfully!`);
      queryClient.invalidateQueries({ queryKey: ['restaurant-settings'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update table count');
    }
  });

  const generateQRCodes = async () => {
    if (tableCount < 1 || tableCount > 100) {
      toast.error('Table count must be between 1 and 100');
      return;
    }

    setGenerating(true);
    
    try {
      const qrs: TableQR[] = [];
      
      for (let i = 1; i <= tableCount; i++) {
        const qrData = `${window.location.origin}/order?table=${i}`;
        const qrCodeUrl = await QRCode.toDataURL(qrData, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        qrs.push({
          tableNumber: i,
          qrCodeUrl,
          paymentCode: paymentCode
        });
      }

      // Update table count in database
      await updateTableCountMutation.mutateAsync(tableCount);
      
      setQrCodes(qrs);
      setShowQRGrid(true);
      
    } catch (error) {
      console.error('Error generating QR codes:', error);
      toast.error('Failed to generate QR codes');
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const printWindow = window.open('', '_blank');
      
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Table QR Codes</title>
              <style>
                @media print {
                  body { margin: 0; padding: 20px; }
                  .qr-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; }
                  .qr-card { page-break-inside: avoid; text-align: center; border: 2px solid #000; padding: 20px; }
                  .qr-card img { width: 250px; height: 250px; }
                  .table-number { font-size: 24px; font-weight: bold; margin: 10px 0; }
                  .payment-code { font-size: 18px; margin: 10px 0; }
                }
                body { font-family: Arial, sans-serif; }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    }
  };

  const handleUpdatePaymentCode = () => {
    if (!newPaymentCode.trim()) {
      toast.error('Please enter a payment code');
      return;
    }

    if (!/^\d{4}$/.test(newPaymentCode)) {
      toast.error('Payment code must be exactly 4 digits');
      return;
    }

    updatePaymentMutation.mutate(parseInt(newPaymentCode));
  };

  const copyPaymentCode = () => {
    navigator.clipboard.writeText(paymentCode);
    toast.success('Payment code copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-semibold dark:text-gray-100 mb-6 sm:mb-8">
          Restaurant Settings
        </h1>

        {/* Table QR Code Generator Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 p-4 sm:p-6 md:p-8 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <QrCode className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Table QR Codes
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Number of Tables
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTableCount(Math.max(1, tableCount - 1))}
                  className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Minus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={tableCount}
                  onChange={(e) => setTableCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg text-center text-lg font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={() => setTableCount(Math.min(100, tableCount + 1))}
                  className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Set the number of tables in your restaurant (1-100)
              </p>
            </div>

            <div className="flex flex-col justify-end">
              <button
                onClick={generateQRCodes}
                disabled={generating}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating QR Codes...
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4" />
                    Generate QR Codes
                  </>
                )}
              </button>
            </div>
          </div>

          {showQRGrid && qrCodes.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handlePrint}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                Print QR Codes ({qrCodes.length} tables)
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Print and place these QR codes on your restaurant tables
              </p>
            </div>
          )}
        </div>

        {/* Payment Code Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 p-4 sm:p-6 md:p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Payment Code
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Current Payment Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={paymentCode}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg text-center text-2xl font-mono font-bold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 tracking-widest"
                />
                <button
                  onClick={copyPaymentCode}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                  title="Copy payment code"
                >
                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Customers will use this code to complete payments
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                New Payment Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={newPaymentCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setNewPaymentCode(value);
                  }}
                  placeholder="Enter 4-digit code"
                  maxLength={4}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg text-center text-2xl font-mono font-bold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={handleUpdatePaymentCode}
                  disabled={updatePaymentMutation.isPending || newPaymentCode.length !== 4}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {updatePaymentMutation.isPending ? 'Updating...' : 'Update'}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Enter a new 4-digit payment code
              </p>
            </div>
          </div>
        </div>

        {/* Hidden Print Section */}
        <div style={{ display: 'none' }}>
          <div ref={printRef}>
            <div className="qr-grid">
              {qrCodes.map((qr) => (
                <div key={qr.tableNumber} className="qr-card">
                  <div className="table-number">Table {qr.tableNumber}</div>
                  <Image src={qr.qrCodeUrl} alt={`Table ${qr.tableNumber}`} fill />
                  <div className="payment-code">
                    Payment Code: <strong>{qr.paymentCode}</strong>
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '10px' }}>
                    Scan to order
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings