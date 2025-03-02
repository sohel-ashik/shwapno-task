'use client';

import { useState, useRef, useEffect } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

const BarcodeScanner = ({ onScanSuccess, onScanError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [decodedResult, setDecodedResult] = useState('');
  const [manualEntry, setManualEntry] = useState('');
  const [torchOn, setTorchOn] = useState(false);
  
  const scannerRef = useRef(null);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = () => {
    setError('');
    setDecodedResult('');
    setIsScanning(true);
  };

  const stopScanner = () => {
    setIsScanning(false);
    setTorchOn(false);
  };

  const handleScan = (err, result) => {
    if (err) {
      console.log('Scan error:', err.message);
      // Only show errors that aren't just "not found" errors
      if (err.name !== 'NotFoundException') {
        setError(err.message || 'Failed to scan barcode');
        if (onScanError) onScanError(err.message || 'Failed to scan barcode');
      }
      return;
    }

    if (result) {
      console.log('Scan result:', result);
      stopScanner();
      setDecodedResult(result.text);
    }
  };

  const handleConfirmBarcode = () => {
    if (decodedResult && onScanSuccess) {
      console.log('Confirming barcode:', decodedResult);
      onScanSuccess(decodedResult);
    }
  };

  const handleRetry = () => {
    setDecodedResult('');
    startScanner();
  };

  const handleManualEntryChange = (e) => {
    // Only allow digits
    const value = e.target.value.replace(/[^0-9]/g, '');
    setManualEntry(value);
  };

  const handleManualEntrySubmit = (e) => {
    e.preventDefault();
    if (manualEntry.trim()) {
      setDecodedResult(manualEntry);
      setManualEntry('');
    }
  };

  const toggleTorch = () => {
    setTorchOn(!torchOn);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Barcode Scanner</h2>
      
      {!decodedResult && !isScanning && (
        <div className="space-y-4">
          <button
            onClick={startScanner}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
          >
            Scan Barcode
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>
          
          <form onSubmit={handleManualEntrySubmit} className="flex space-x-2">
            <input
              type="text"
              value={manualEntry}
              onChange={handleManualEntryChange}
              placeholder="Enter barcode manually"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              maxLength="13"
            />
            <button
              type="submit"
              className="py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none"
            >
              Enter
            </button>
          </form>
        </div>
      )}
      
      {error && (
        <div className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">
          {error}
          <button 
            className="ml-2 text-red-700 underline" 
            onClick={() => setError('')}
          >
            Dismiss
          </button>
        </div>
      )}
      
      {isScanning && (
        <div className="relative">
          <div 
            ref={scannerRef}
            className="w-full aspect-square bg-black rounded-lg overflow-hidden"
          >
            <BarcodeScannerComponent
              onUpdate={handleScan}
              torch={torchOn}
              constraints={{
                facingMode: "environment",
                width: { ideal: 1280 },
                height: { ideal: 720 },
                aspectRatio: { ideal: 1 }
              }}
              style={{ width: '100%', height: '100%' }}
            />
            
            {/* Scanning guide overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-48 border-2 border-red-500 rounded-lg">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-red-500 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-red-500 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-red-500 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-red-500 rounded-br-lg"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <button
              onClick={stopScanner}
              className="flex-1 py-2 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={toggleTorch}
              className="flex-1 py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none"
            >
              {torchOn ? 'Turn Off Light' : 'Turn On Light'}
            </button>
          </div>
        </div>
      )}
      
      {decodedResult && (
        <div className="mt-4 p-4 bg-green-50 border border-green-300 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Barcode Detected:</h3>
          <p className="text-lg font-mono text-center bg-white p-2 border border-gray-200 rounded mb-4">{decodedResult}</p>
          
          <div className="flex space-x-2">
            <button
              onClick={handleConfirmBarcode}
              className="flex-1 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
            >
              Confirm
            </button>
            <button
              onClick={handleRetry}
              className="flex-1 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;