import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../config/api";
import AddCategoryModal from "./AddCategoryModal";
import CategoryList from "./CategoryList";
import axios from 'axios';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/allcategory`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to load categories. Please try again later.");
    }
  };

  const uploadImage = async (imageFile) => {
    try {
      console.log('Starting image upload...', imageFile);
      
      // If imageFile is already a URL, return it directly
      if (typeof imageFile === 'string' && imageFile.startsWith('http')) {
        return imageFile;
      }

      // Validate file
      if (!imageFile || !imageFile.type.startsWith('image/')) {
        throw new Error('Please select a valid image file');
      }

      const formData = new FormData();
      formData.append('file', imageFile);

      const uploadResponse = await axios.post('/upload', formData, {
        headers: {
          'Authorization': 'QuindlTokPATFileUpload2025#$$TerOiu$',
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', uploadResponse.data);

      if (!uploadResponse.data || !uploadResponse.data.filePath) {
        throw new Error('Invalid response from upload server');
      }

      return uploadResponse.data.filePath;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  };

  const handleAddCategory = async (categoryName, image, description, subcategories) => {
    try {
      console.log('Starting category addition with:', { 
        categoryName, 
        description,
        subcategories
      });
      
      // Upload image first
      console.log('Uploading image...');
      const imageUrl = await uploadImage(image);
      console.log('Image uploaded successfully:', imageUrl);

      // Instead of making the API call, just log what would be sent
      console.log('Would add category with:', {
        categoryName,
        categoryType: description || "Others",
        categotyImage: imageUrl,
        subcategories: subcategories
      });

      // Since there's no actual API call, we can skip the response validation
      // but we should still refresh the categories list and close the modal
      await fetchCategories();
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding category:", error);
      alert(`Failed to add category: ${error.message}`);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsEditing(true);
  };

  const handleSaveEdit = async (categoryId, categoryName, image, categoryType, subcategories) => {
    try {
      let imageUrl = editingCategory.categotyImage;
      
      // Upload new image if provided
      if (image && typeof image !== 'string') {
        console.log('Uploading new image for edit...');
        imageUrl = await uploadImage(image);
      }

      const response = await fetch(
        `${API_BASE_URL}/categories/editcategory/${categoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categoryName,
            categoryType,
            categotyImage: imageUrl,
            subcategories,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update category");
      }

      await fetchCategories();
      setIsEditing(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Error updating category:", error);
      alert(`Failed to update category: ${error.message}`);
    }
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category._id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/categories/editcategory/${categoryToDelete}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isDeleted: true
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      setCategories(prevCategories => 
        prevCategories.filter(category => category._id !== categoryToDelete)
      );
      
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. Please try again.");
    }
  };

  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
              <path d="M3 6h18"></path>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </div>

          <h2 className="text-xl font-bold mb-2">Delete Category</h2>
          <p className="text-gray-600 text-center mb-6">
            Do you want to delete this category? This action can't be undone
          </p>

          <div className="flex gap-4 w-full">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setCategoryToDelete(null);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <CategoryList 
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={() => setShowAddModal(true)}
      />

      {showAddModal && (
        <AddCategoryModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddCategory}
        />
      )}

      {isEditing && editingCategory && (
        <AddCategoryModal
          onClose={() => {
            setIsEditing(false);
            setEditingCategory(null);
          }}
          onAdd={(name, image, description, subcategories) => 
            handleSaveEdit(
              editingCategory._id,
              name,
              image,
              description || "Others",
              subcategories
            )
          }
          initialData={editingCategory}
          isEditing={true}
        />
      )}

      {showDeleteModal && <DeleteConfirmationModal />}
    </div>
  );
};

export default CategoryManagement;