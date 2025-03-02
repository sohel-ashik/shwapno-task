'use client';

import { useState } from 'react';

const AddCategoryForm = ({ onAddCategory, onCancel }) => {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmedName = categoryName.trim();
    
    if (!trimmedName) {
      setError('Category name cannot be empty');
      return;
    }
    
    onAddCategory(trimmedName);
    setCategoryName('');
    setError('');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200">
      <h3 className="font-semibold mb-3">Add New Category</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
            Category Name
          </label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category name"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        
        <div className="flex space-x-3">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Category
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategoryForm;