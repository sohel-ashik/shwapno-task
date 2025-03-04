'use client';

import { useState } from 'react';
import ProductCard from '../utils/ProductCard';

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
                <div className="mt-2">
                  <select
                    className="w-full p-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    appearance-none cursor-pointer transition-colors duration-200"
                    value={product.category}
                    onChange={(e) => handleMoveProduct(product.id, e.target.value)}
                    style={{
                      backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                      backgroundPosition: "right 0.5rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5em 1.5em",
                      paddingRight: "2.5rem"
                    }}
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