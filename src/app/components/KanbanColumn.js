'use client';

import { useDrop } from 'react-dnd';
import ProductCard from './ProductCard';

const KanbanColumn = ({ category, products, onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'PRODUCT',
    drop: (item) => onDrop(item.id, category),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`w-80 flex-shrink-0 bg-gray-100 rounded-lg p-4 flex flex-col h-[calc(100vh-12rem)] ${
        isOver ? 'bg-blue-50 border-2 border-blue-300' : ''
      }`}
    >
      <h3 className="font-semibold text-lg mb-3 pb-2 border-b-2 border-gray-200 flex items-center justify-between">
        {category && <span className="text-gray-800">{category}</span>}
        {products.length > 0 && (
          <span className="bg-blue-500 text-white text-sm px-4 py-1 rounded-md">{products.length}</span>
        )}
      </h3>
      
      <div className="overflow-y-auto flex-1 space-y-3 p-1">
        {products.length === 0 ? (
          <div className="text-gray-500 text-center py-4">
            No products in this category
          </div>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;