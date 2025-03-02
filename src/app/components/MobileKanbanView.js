'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';

const MobileKanbanView = ({ categories, products, onDrop }) => {
  const [activeCategory, setActiveCategory] = useState(categories[0] || 'Uncategorized');
  
  const filteredProducts = products.filter(p => p.category === activeCategory);
  
  const handleMoveProduct = (productId, targetCategory) => {
    onDrop(productId, targetCategory);
  };

  return (
    <div className="w-full">
      {/* Category Tabs */}
      <div className="flex overflow-x-auto mb-4 pb-2 scrollbar-hide border-b border-gray-200">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 whitespace-nowrap text-sm font-medium mr-2 rounded-t-lg ${
              activeCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category} ({products.filter(p => p.category === category).length})
          </button>
        ))}
      </div>
      
      {/* Current Category Content */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-bold text-lg mb-3">
          {activeCategory} ({filteredProducts.length})
        </h3>
        
        <div className="space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="text-gray-500 text-center py-6">
              No products in this category
            </div>
          ) : (
            filteredProducts.map(product => (
              <div key={product.id} className="relative">
                <ProductCard product={product} />
                
                {/* Mobile-friendly category selector */}
                <div className="mt-1">
                  <select
                    className="w-full p-1 text-sm border border-gray-300 rounded"
                    value={product.category}
                    onChange={(e) => handleMoveProduct(product.id, e.target.value)}
                  >
                    <option disabled>Move to...</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === product.category
                          ? `✓ ${category}`
                          : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileKanbanView;