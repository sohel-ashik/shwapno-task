'use client';

import { useState, useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import KanbanColumn from './KanbanColumn';
import AddCategoryForm from './AddCategoryForm';
import MobileKanbanView from './MobileKanbanView';

// Custom backend to use TouchBackend on mobile and HTML5Backend on desktop
const CustomBackend = ({ children}) => {
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

const KanbanBoard = ({products, categories, setProducts, setCategories }) => {
  // const [categories, setCategories] = useState(['Uncategorized']);
  // const [products, setProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const scrollIntervalRef = useRef(null);

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

  // Setup auto-scrolling during drag
  useEffect(() => {
    const handleDragOver = (e) => {
      if (!isDragging || !scrollContainerRef.current) return;
      
      const container = scrollContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const mouseX = e.clientX;
      
      // Define scroll zones (e.g., 100px from edges)
      const scrollZoneSize = 100;
      const leftZone = containerRect.left + scrollZoneSize;
      const rightZone = containerRect.right - scrollZoneSize;
      
      // Clear any existing interval
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
      
      // Set up scrolling if in scroll zones
      if (mouseX < leftZone) {
        // Scroll left
        scrollIntervalRef.current = setInterval(() => {
          container.scrollLeft -= 10;
        }, 20);
      } else if (mouseX > rightZone) {
        // Scroll right
        scrollIntervalRef.current = setInterval(() => {
          container.scrollLeft += 10;
        }, 20);
      }
    };
    
    const handleDragEnd = () => {
      setIsDragging(false);
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };
    
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('dragend', handleDragEnd);
    document.addEventListener('drop', handleDragEnd);
    
    return () => {
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('dragend', handleDragEnd);
      document.removeEventListener('drop', handleDragEnd);
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [isDragging]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories and products from the API
        const categoriesResponse = await fetch('https://shwapno-task-backend.vercel.app/api/categories');
        const productsResponse = await fetch('https://shwapno-task-backend.vercel.app/api/products');
        
        if (!categoriesResponse.ok || !productsResponse.ok) {
          throw new Error('Failed to fetch data from API');
        }
        
        const categoriesData = await categoriesResponse.json();
        const productsData = await productsResponse.json();
        
        // Check if we have valid data with the expected structure
        if (categoriesData.status && Array.isArray(categoriesData.data)) {
          // Extract category names from the data array
          const categoryNames = categoriesData.data.map(cat => cat.name);
          setCategories(categoryNames.length > 0 ? categoryNames : ['Uncategorized']);
        } else {
          setCategories(['Uncategorized']);
        }
        
        if (productsData.status && Array.isArray(productsData.data)) {
          // Map the products to include an id property based on _id
          const mappedProducts = productsData.data.map(product => ({
            ...product,
            id: product._id // Use _id as the id for drag and drop functionality
          }));
          setProducts(mappedProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to ensure the app doesn't break if API is down
        setCategories(['Uncategorized']);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleDrop = async (productId, targetCategory) => {
    // Update local state immediately for responsive UI
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, category: targetCategory } 
          : product
      )
    );

    try {
      // Make API call to update the product category
      const response = await fetch(`https://shwapno-task-backend.vercel.app/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: targetCategory }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update product category');
      }
      
      console.log(`Successfully moved product ${productId} to ${targetCategory}`);
    } catch (error) {
      console.error('Error updating product category:', error);
      
      // Show error alert
      alert(`Failed to update product category: ${error.message}`);
      
      // Revert the local state change if the API call failed
      setProducts(prevProducts => 
        prevProducts.map(product => {
          // Find the original product to get its previous category
          const originalProduct = prevProducts.find(p => p.id === productId);
          return product.id === productId && originalProduct
            ? { ...product, category: originalProduct.category }
            : product;
        })
      );
    }
  };

  const handleAddCategory = async (categoryName) => {
    if (!categoryName.trim() || categories.includes(categoryName)) {
      return;
    }
    
    try {
      // Make API call to add the category
      const response = await fetch('https://shwapno-task-backend.vercel.app/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categoryName }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add category');
      }
      
      // Update local state after successful API call
      setCategories(prevCategories => [...prevCategories, categoryName]);
      setIsAddingCategory(false);
      
      console.log(`Added new category: ${categoryName}`);
    } catch (error) {
      console.error('Error adding category:', error);
      // You might want to show an error message to the user here
    }
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

  // Skeleton for loading state
  const renderSkeletonColumns = () => {
    return Array(3).fill(0).map((_, index) => (
      <div key={index} className="w-80 flex-shrink-0 bg-gray-100 rounded-lg p-4 flex flex-col h-[calc(100vh-12rem)]">
        <div className="h-8 bg-gray-200 rounded-md mb-3 animate-pulse"></div>
        <div className="overflow-y-auto flex-1 space-y-3 p-1">
          {Array(4).fill(0).map((_, cardIndex) => (
            <div key={cardIndex} className="bg-white rounded-lg p-3 shadow-sm animate-pulse">
              <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <CustomBackend>
      <div className="w-full">
        <div className="flex justify-between sm:flex-row flex-col gap-4 items-center mb-4">
          <h2 className="text-xl font-bold">Inventory Kanban Board</h2>
          <button
            onClick={() => setIsAddingCategory(true)}
            className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700"
            disabled={isLoading}
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

        {isLoading ? (
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {renderSkeletonColumns()}
          </div>
        ) : isMobile ? (
          <MobileKanbanView 
            categories={categories}
            products={products}
            onDrop={handleDrop}
          />
        ) : (
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto space-x-4 pb-4"
            onDragStart={() => setIsDragging(true)}
          >
            {categories?.map(category => (
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