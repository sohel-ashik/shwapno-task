'use client';

import { useState } from 'react';
import BarcodeScanner from './components/BarcodeScanner';
import ScanResult from './components/ScanResult';
import KanbanBoard from './components/KanbanBoard';

export default function Dashboard() {
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [kanbanProducts, setKanbanProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const handleAddToInventory = async (product) => {
    setIsSubmitting(true);
    setApiError('');
    
    try {
      const response = await fetch('https://shwapno-task-backend.vercel.app/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...product,
          category: 'Uncategorized'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product to inventory');
      }
      
      const data = await response.json();
      
      const newProduct = {
        ...data.data,
        id: data.data._id, // Use the ID returned from the API
        category: 'Uncategorized'
      };
      
      setKanbanProducts(prev => [...prev, newProduct]);
      setScannedBarcode(''); // Reset for next scan
    } catch (error) {
      console.error('Error adding product to inventory:', error);
      setApiError(error.message || 'Failed to add product to inventory. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Management System</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scanner Section */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Barcode Scanner</h2>
            
            {apiError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md">
                <p className="text-sm">{apiError}</p>
                <button 
                  className="text-xs text-red-600 underline mt-1"
                  onClick={() => setApiError('')}
                >
                  Dismiss
                </button>
              </div>
            )}
            
            {showScanner ? (
              <BarcodeScanner
                onScanSuccess={handleScanSuccess}
                onScanError={handleScanError}
              />
            ) : (
              <button
                onClick={() => setShowScanner(true)}
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
                disabled={isSubmitting}
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
            
            {isSubmitting && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600 mr-2"></div>
                <p className="text-sm text-blue-700">Adding product to inventory...</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Kanban Board Section */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <KanbanBoard products={kanbanProducts} categories={categories} setProducts={setKanbanProducts} setCategories={setCategories} />
          </div>
        </div>
      </div>
    </div>
  );
}