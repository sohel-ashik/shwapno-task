'use client';

import { useState, useRef, useEffect } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

const BarcodeScanner = ({ onScanSuccess, onScanError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [decodedResult, setDecodedResult] = useState('');
  const [manualEntry, setManualEntry] = useState('');
  const [torchOn, setTorchOn] = useState(false);
  const [processing, setProcessing] = useState(false);
  
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

  const handleScan = async (err, result) => {
    if (err) {
      console.log('Scan error:', err.message);
      // Only show errors that aren't just "not found" errors
      if (err.name !== 'NotFoundException') {
        setError(err.message || 'Failed to scan barcode');
        if (onScanError) onScanError(err.message || 'Failed to scan barcode');
      }
      return;
    }

    if (result && !processing) {
      console.log('Scan result:', result);
      setProcessing(true);
      stopScanner();
      setDecodedResult(result.text);
      
      // Directly call the success handler without confirmation
      if (onScanSuccess) {
        console.log('Processing barcode:', result.text);
        await onScanSuccess(result.text);
      }
      setProcessing(false);
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

  const handleManualEntrySubmit = async (e) => {
    e.preventDefault();
    if (manualEntry.trim() && !processing) {
      setProcessing(true);
      setDecodedResult(manualEntry);
      
      // Directly call the success handler for manual entry
      if (onScanSuccess) {
        console.log('Processing manual barcode:', manualEntry);
        await onScanSuccess(manualEntry);
      }
      
      setManualEntry('');
      setProcessing(false);
    }
  };

  const toggleTorch = () => {
    setTorchOn(!torchOn);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-4">
      {/* <h2 className="text-xl font-bold mb-4 text-center">Barcode Scanner</h2> */}
      
      {!decodedResult && !isScanning && (
        <div className="space-y-4">
          <button
            onClick={startScanner}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
            disabled={processing}
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
              disabled={processing}
            />
            <button
              type="submit"
              className="py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none"
              disabled={processing}
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
            className="w-full"
          >
            <div className="relative w-full h-full">
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
              
              {/* Red border overlay that fits exactly on top of the video */}
              <div className="absolute inset-0 border-2 border-red-500 rounded-lg pointer-events-none"></div>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <button
              onClick={stopScanner}
              className="flex-1 py-2 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none"
              disabled={processing}
            >
              Cancel
            </button>
            <button
              onClick={toggleTorch}
              className="flex-1 py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none"
              disabled={processing}
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
              onClick={handleRetry}
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
              disabled={processing}
            >
              Scan Again
            </button>
          </div>
        </div>
      )}
      
      {processing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-center">Processing barcode...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;