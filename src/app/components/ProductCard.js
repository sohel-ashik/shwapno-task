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
      className={`bg-white p-3 rounded-md shadow-sm border border-gray-200 cursor-move ${
        isDragging ? 'opacity-40' : ''
      }`}
      style={{ touchAction: 'none' }} // Helps with mobile drag
    >
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-medium text-sm truncate flex-1">{product.description}</h4>
      </div>
      
      <div className="text-gray-600 text-xs space-y-1">
        <div className="flex justify-between">
          <span>Material:</span>
          <span className="font-medium">{product.material}</span>
        </div>
        <div className="flex justify-between">
          <span>Barcode:</span>
          <span className="font-mono">{product.barcode}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;