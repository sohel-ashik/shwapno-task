'use client';

import { useState, useEffect } from 'react';
import { useZxing } from 'react-zxing';

const BarcodeScanner = ({ onScanSuccess, onScanError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');

  const { ref, torch } = useZxing({
    onDecodeResult(result) {
      const decodedText = result.getText();
      onScanSuccess(decodedText);
      
      // Pause briefly after successful scan
      setIsScanning(false);
      setTimeout(() => {
        setIsScanning(true);
      }, 1000);
    },
    onError(error) {
      // Ignore "not found" errors as they're normal during scanning
      if (error.message.includes('Not Found')) {
        return;
      }
      setError(`Scan error: ${error.message}`);
      onScanError(error.message);
    },
    paused: !isScanning,
  });

  const startScanner = () => {
    setError('');
    setIsScanning(true);
  };

  const stopScanner = () => {
    setIsScanning(false);
  };

  const toggleTorch = () => {
    torch.toggle();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-center">Barcode Scanner</h2>
      
      <div className="mb-4 space-y-2">
        {!isScanning ? (
          <button
            onClick={startScanner}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
          >
            Start Scanner
          </button>
        ) : (
          <>
            <button
              onClick={stopScanner}
              className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none"
            >
              Stop Scanner
            </button>
            <button
              onClick={toggleTorch}
              className="w-full py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none"
            >
              Toggle Flashlight
            </button>
          </>
        )}
      </div>
      
      {error && (
        <div className="text-red-500 text-sm mb-4">{error}</div>
      )}
      
      <div className="relative w-full aspect-square">
        {isScanning && (
          <>
            <video
              ref={ref}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-red-500"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BarcodeScanner;