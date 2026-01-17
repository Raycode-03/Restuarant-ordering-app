"use client"
import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner';
import { QrCode, Printer, Plus, Minus, Copy, RefreshCw } from 'lucide-react';
import QRCode from 'qrcode';

interface TableQR {
  tableNumber: number;
  qrCodeUrl: string;
  paymentCode: string;
}

function AdminSettings() {
  const [loading, setLoading] = useState({
    fetch: true,
    generate: false,
    updateCode: false,
  });

  const [tableCount, setTableCount] = useState(10);
  const [paymentCode, setPaymentCode] = useState('');
  const [newPaymentCode, setNewPaymentCode] = useState('');
  const [qrCodes, setQrCodes] = useState<TableQR[]>([]);
  const [showQRGrid, setShowQRGrid] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const result = await response.json();

      if (response.ok && result.success) {
        setTableCount(result.data.tableCount || 10);
        setPaymentCode(result.data.paymentCode || '');
      } else {
        toast.error('Failed to load settings');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Error loading settings');
    } finally {
      setLoading(prev => ({ ...prev, fetch: false }));
    }
  };

  const generateQRCodes = async () => {
    if (tableCount < 1 || tableCount > 100) {
      toast.error('Table count must be between 1 and 100');
      return;
    }

    setLoading(prev => ({ ...prev, generate: true }));
    
    try {
      const qrs: TableQR[] = [];
      
      for (let i = 1; i <= tableCount; i++) {
        // Generate QR code data - this would be your app URL with table number
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
          paymentCode: paymentCode || '0000'
        });
      }

      setQrCodes(qrs);
      setShowQRGrid(true);
      toast.success(`Generated ${tableCount} QR codes successfully!`);
    } catch (error) {
      console.error('Error generating QR codes:', error);
      toast.error('Failed to generate QR codes');
    } finally {
      setLoading(prev => ({ ...prev, generate: false }));
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

  const updatePaymentCode = async () => {
    if (!newPaymentCode.trim()) {
      toast.error('Please enter a payment code');
      return;
    }

    if (!/^\d{4}$/.test(newPaymentCode)) {
      toast.error('Payment code must be exactly 4 digits');
      return;
    }

    setLoading(prev => ({ ...prev, updateCode: true }));

    try {
      const response = await fetch('/api/admin/settings/payment-code', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentCode: newPaymentCode }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Payment code updated successfully!');
        setPaymentCode(newPaymentCode);
        setNewPaymentCode('');
        // Regenerate QR codes with new payment code
        if (showQRGrid) {
          generateQRCodes();
        }
      } else {
        toast.error('Failed to update payment code: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating payment code:', error);
      toast.error('Error updating payment code');
    } finally {
      setLoading(prev => ({ ...prev, updateCode: false }));
    }
  };

  const copyPaymentCode = () => {
    navigator.clipboard.writeText(paymentCode);
    toast.success('Payment code copied to clipboard!');
  };

  if (loading.fetch) {
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
            {/* Table Count Input */}
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

            {/* Generate Button */}
            <div className="flex flex-col justify-end">
              <button
                onClick={generateQRCodes}
                disabled={loading.generate}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {loading.generate ? (
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

          {/* Print Button - Shows after generation */}
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
            {/* Current Payment Code */}
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

            {/* Update Payment Code */}
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
                  onClick={updatePaymentCode}
                  disabled={loading.updateCode || newPaymentCode.length !== 4}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading.updateCode ? 'Updating...' : 'Update'}
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
                  <img src={qr.qrCodeUrl} alt={`Table ${qr.tableNumber}`} />
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