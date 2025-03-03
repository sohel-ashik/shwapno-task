'use client';

import { useState, useEffect } from 'react';

const ScanResult = ({ barcode, onAddToInventory }) => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!barcode) return;
    
    const fetchProductDetails = async () => {
      setLoading(true);
      setError('');
      
      try {
        console.log('Fetching product details for barcode:', barcode);
        
        // const apiUrl = `https://products-test-aci.onrender.com/product/${barcode}`;
        const apiUrl = `/api/proxy?barcode=${barcode}`;

        
        const response = await fetch(apiUrl, {
            headers: { 'Content-Type': 'application/json' },
          });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data.product) {
          throw new Error('Product not found');
        }

        setProduct(data.product);
      } catch (err) {
        console.error('Error fetching product:', err);
        
        // Simplified error handling
        if (err.name === 'AbortError') {
          setError('Request timed out. Please try again.');
        } else {
          setError('Failed to fetch product. Using test data instead.');
        }
        
        // Use mock data on any error
        createMockProduct(barcode);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [barcode, retryCount]);

  const handleAddToInventory = () => {
    if (product) {
      onAddToInventory({
        ...product,
        category: 'Uncategorized' // Default category
      });
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Create a mock product for testing when API is down
  const createMockProduct = (barcodeValue = barcode) => {
    setProduct({
      barcode: barcodeValue,
      material: `MAT-${barcodeValue.substring(0, 6)}`,
      description: `Test Product (Barcode: ${barcodeValue})`,
      price: Math.floor(Math.random() * 100) + 1
    });
  };

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto p-4 flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Fetching product information...</p>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="w-full max-w-md mx-auto bg-red-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-red-700 mb-2">Error</h3>
        <p className="text-red-600 mb-4">{error}</p>
        
        <button 
          onClick={handleRetry} 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-4">
      <h3 className="text-lg font-semibold mb-3">Scan Result</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Barcode:</span>
          <span className="font-medium">{product.barcode}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Material ID:</span>
          <span className="font-medium">{product.material}</span>
        </div>
        <div className="pt-2 border-t">
          <span className="text-gray-600">Description:</span>
          <p className="font-medium mt-1">{product.description}</p>
        </div>
      </div>
      
      <button
        onClick={handleAddToInventory}
        className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
      >
        Add to Inventory
      </button>
    </div>
  );
};

export default ScanResult;