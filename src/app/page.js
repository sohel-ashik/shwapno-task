'use client';

import { useState } from 'react';
import BarcodeScanner from './components/BarcodeScanner';
import ScanResult from './components/ScanResult';
import KanbanBoard from './components/KanbanBoard';

export default function Dashboard() {
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [kanbanProducts, setKanbanProducts] = useState([]);

  // Handler for successful barcode scan
  const handleScanSuccess = (barcode) => {
    setScannedBarcode(barcode);
    setShowScanner(false);
  };

  // Handler for barcode scan errors
  const handleScanError = (error) => {
    console.error('Scan error:', error);
    // You could show an error notification here
  };

  // Handler to add product to inventory after scanning
  const handleAddToInventory = (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(), // Temporary ID for demo
      category: 'Uncategorized'
    };
    
    setKanbanProducts(prev => [...prev, newProduct]);
    setScannedBarcode(''); // Reset for next scan
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Management System</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scanner Section */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Barcode Scanner</h2>
            
            {showScanner ? (
              <BarcodeScanner
                onScanSuccess={handleScanSuccess}
                onScanError={handleScanError}
              />
            ) : (
              <button
                onClick={() => setShowScanner(true)}
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
              >
                Open Scanner
              </button>
            )}
            {/* {console.log("scannedBarcode",scannedBarcode)} */}
            {scannedBarcode && (
              <ScanResult
                barcode={scannedBarcode}
                onAddToInventory={handleAddToInventory}
              />
            )}
          </div>
        </div>
        
        {/* Kanban Board Section */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <KanbanBoard />
          </div>
        </div>
      </div>
    </div>
  );
}