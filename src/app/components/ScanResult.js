'use client';

import { useState, useEffect } from 'react';

const ScanResult = ({ barcode, onAddToInventory }) => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!barcode) return;
    
    const fetchProductDetails = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await fetch(`https://products-test-aci.onrender.com/product/${barcode}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.status || !data.product) {
          throw new Error('Product not found');
        }
        
        setProduct(data.product);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [barcode]);

  const handleAddToInventory = () => {
    if (product) {
      onAddToInventory({
        ...product,
        category: 'Uncategorized' // Default category
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto p-4 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto bg-red-50 p-4 rounded-lg text-center">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => setError('')} 
          className="mt-3 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
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