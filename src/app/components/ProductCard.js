'use client';

import { useDrag } from 'react-dnd';

const ProductCard = ({ product }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'PRODUCT',
    item: { id: product.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-all duration-200 cursor-move ${
        isDragging ? 'opacity-40 scale-95' : ''
      }`}
      style={{ touchAction: 'none' }} // Helps with mobile drag
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-800 truncate flex-1">{product.description}</h4>
      </div>
      
      <div className="mt-3 space-y-2">
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
          <span className="text-xs text-gray-500">Material</span>
          <span className="font-medium text-sm text-gray-700">{product.material}</span>
        </div>
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
          <span className="text-xs text-gray-500">Barcode</span>
          <span className="font-mono text-sm text-gray-700">{product.barcode}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;