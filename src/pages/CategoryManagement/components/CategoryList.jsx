import React, { useState } from "react";
import { MoreVertical, Plus } from "lucide-react";
import { handleImageError, getImageUrl } from '../../../utils/imageUtils';

const CategoryList = ({ categories, onEdit, onDelete, onAdd }) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (e, categoryId) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === categoryId ? null : categoryId);
  };

  const handleEdit = (category) => {
    onEdit(category);
    setOpenMenuId(null);
  };

  const handleDelete = (category) => {
    onDelete(category);
    setOpenMenuId(null);
  };

  const ActionMenu = ({ category }) => (
    <div className="relative">
      <button
        onClick={(e) => toggleMenu(e, category._id)}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <MoreVertical size={18} className="text-gray-500" />
      </button>

      {openMenuId === category._id && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <button
              onClick={() => handleEdit(category)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit
            </button>
            <button
              onClick={() => handleDelete(category)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderSubcategories = (subcategories) => {
    if (!subcategories || !subcategories.length) return "-";
    return subcategories.join(", ");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Category Management</h1>
          <span className="text-sm text-gray-500">
            {categories.length} categories
          </span>
        </div>
        <button
          onClick={() => onAdd()}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-12 gap-4 p-4 border-b">
          <div className="col-span-3">
            <h3 className="text-sm font-medium text-gray-500">Category</h3>
          </div>
          <div className="col-span-7">
            <h3 className="text-sm font-medium text-gray-500">Sub Category</h3>
          </div>
          <div className="col-span-2">
            <h3 className="text-sm font-medium text-gray-500 text-right">Action</h3>
          </div>
        </div>

        {categories.map((category) => (
          <div
            key={category._id}
            className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50"
          >
            <div className="col-span-3 flex items-center">
              <span className="text-sm font-medium">{category.categoryName}</span>
            </div>
            <div className="col-span-7 flex items-center">
              <span className="text-sm">{renderSubcategories(category.subCategories)}</span>
            </div>
            <div className="col-span-2 flex items-center justify-end">
              <ActionMenu category={category} />
            </div>
          </div>
        ))} 

        {categories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <p className="mt-4">No categories found</p>
            <button
              onClick={() => onAdd()}
              className="mt-4 text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <Plus size={16} />
              Add Category
            </button>
          </div>
        )}

        {categories.length > 0 && (
          <div className="flex justify-center p-4 border-t">
            <button
              onClick={() => onAdd()}
              className="text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <div className="flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </div>
              Add More Category
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;