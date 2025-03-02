'use client';

import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import KanbanColumn from './KanbanColumn';
import AddCategoryForm from './AddCategoryForm';
import MobileKanbanView from './MobileKanbanView';

// Custom backend to use TouchBackend on mobile and HTML5Backend on desktop
const CustomBackend = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      {children}
    </DndProvider>
  );
};

const KanbanBoard = () => {
  const [categories, setCategories] = useState(['Uncategorized']);
  const [products, setProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Simulated data fetch - in a real app, replace with API calls
  useEffect(() => {
    // This would be your API call
    const fetchData = async () => {
      try {
        // For demo purposes, we're using dummy data
        // Replace with actual API calls
        const dummyCategories = ['Uncategorized', 'Electronics', 'Groceries'];
        const dummyProducts = [
          { 
            id: '1', 
            material: 542516, 
            barcode: '8941102311675', 
            description: 'Vaseline Petroleum Jelly Original 50ml',
            category: 'Uncategorized'
          },
          { 
            id: '2', 
            material: 142857, 
            barcode: '7891234567890', 
            description: 'Smartphone XYZ Model',
            category: 'Electronics'
          },
          { 
            id: '3', 
            material: 987654, 
            barcode: '1234567890123', 
            description: 'Chocolate Bar 100g',
            category: 'Groceries'
          }
        ];
        
        setCategories(dummyCategories);
        setProducts(dummyProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  const handleDrop = (productId, targetCategory) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, category: targetCategory } 
          : product
      )
    );

    // In a real app, you would update the backend here
    console.log(`Moved product ${productId} to ${targetCategory}`);
  };

  const handleAddCategory = (categoryName) => {
    if (!categoryName.trim() || categories.includes(categoryName)) {
      return;
    }
    
    setCategories(prevCategories => [...prevCategories, categoryName]);
    setIsAddingCategory(false);
    
    // In a real app, you would update the backend here
    console.log(`Added new category: ${categoryName}`);
  };

  const handleAddProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(), // Temporary ID for demo
      category: 'Uncategorized'
    };
    
    setProducts(prevProducts => [...prevProducts, newProduct]);
    
    // In a real app, you would update the backend here
    console.log('Added new product:', newProduct);
  };

  return (
    <CustomBackend>
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Inventory Kanban Board</h2>
          <button
            onClick={() => setIsAddingCategory(true)}
            className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700"
          >
            Add Category
          </button>
        </div>

        {isAddingCategory && (
          <AddCategoryForm 
            onAddCategory={handleAddCategory} 
            onCancel={() => setIsAddingCategory(false)}
          />
        )}

        {isMobile ? (
          <MobileKanbanView 
            categories={categories}
            products={products}
            onDrop={handleDrop}
          />
        ) : (
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {categories.map(category => (
              <KanbanColumn
                key={category}
                category={category}
                products={products.filter(p => p.category === category)}
                onDrop={handleDrop}
              />
            ))}
          </div>
        )}
      </div>
    </CustomBackend>
  );
};

export default KanbanBoard;